import { createFileRoute, useLocation } from "@tanstack/react-router";
import type { Message } from "@anvia/core";
import { createHttpClientTransport, type UIMessage } from "@anvia/client";
import { initialMessagesFromMemory, useChat } from "@anvia/react";
import {
  ChatProvider,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@anvia/react-ui";
import { useEffect, useMemo, useRef } from "react";

export const Route = createFileRoute("/s/$id")({
  // Load the saved messages of this session before the page renders.
  loader: async ({ params }) => {
    const res = await fetch(`/api/sessions/${params.id}/messages`);
    if (!res.ok) throw new Error(`Failed to load session: ${res.status}`);
    const messages = (await res.json()) as Message[];
    return { initialMessages: initialMessagesFromMemory(messages) };
  },
  component: SessionPage,
});

function SessionPage() {
  const { id } = Route.useParams();
  const { initialMessages } = Route.useLoaderData();

  // key={id}: a new session gets a fresh chat state.
  return <Chat key={id} sessionId={id} initialMessages={initialMessages} />;
}

function Chat({ sessionId, initialMessages }: { sessionId: string; initialMessages: UIMessage[] }) {
  // /api/chat is proxied to the API's /chat route (see vite.config.ts).
  const transport = useMemo(
    () => createHttpClientTransport({ endpoint: `/api/chat?sessionId=${encodeURIComponent(sessionId)}` }),
    [sessionId],
  );
  const chat = useChat({ transport, initialMessages });
  const lastMessageId = chat.messages.at(-1)?.id;

  // First message sent from the new-chat composer.
  const pendingMessage = useLocation({
    select: (location) => (location.state as { pendingMessage?: string }).pendingMessage,
  });
  const sentPending = useRef(false);

  useEffect(() => {
    if (!pendingMessage) return;

    // Wait one tick. In StrictMode, React runs this effect, cleans it up, then runs it again.
    // useChat aborts any request that is in flight at that cleanup, so the send must not start before it.
    const timer = window.setTimeout(() => {
      if (sentPending.current) return;
      sentPending.current = true;
      void chat.sendMessage({ text: pendingMessage });

      // Clear the pending message from history, so a refresh does not send it again.
      const { pendingMessage: _ignored, ...rest } = window.history.state ?? {};
      window.history.replaceState(rest, "");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pendingMessage, chat]);

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-12 items-center px-4 text-sm font-medium text-muted">
        <span className="mr-2 text-accent">✻</span>
        Study Buddy
      </header>

      <ChatProvider controller={chat}>
        <ThreadPrimitive.Root className="flex min-h-0 flex-1 flex-col">
          <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto">
            <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
              <ThreadPrimitive.Empty>
                <div className="mt-24 text-center font-serif-body text-3xl text-ink">
                  What do you want to study today?
                </div>
              </ThreadPrimitive.Empty>

              <ThreadPrimitive.Messages className="flex flex-col gap-6">
                <MessagePrimitive.Root>
                  {(message) => (
                    <div
                      className={
                        message.role === "user"
                          ? "ml-auto w-fit max-w-[80%] rounded-2xl bg-bubble px-4 py-2.5 text-ink"
                          : "max-w-full font-serif-body text-[17px] leading-8 text-ink"
                      }
                    >
                      <MessagePrimitive.Content>
                        {/* Parts owns the smooth stream for the message that is currently streaming.
                            Newly revealed text gets data-state="revealing", which fades in (styles.css). */}
                        <MessagePrimitive.Parts
                          stream={{
                            isStreaming: chat.status === "streaming" && message.id === lastMessageId,
                            resetKey: message.id,
                            flushImmediately: chat.status === "error",
                          }}
                        >
                          {(part) =>
                            part.type === "text" ? (
                              // No children: the Markdown reads the part's text itself and streams per block.
                              <MessagePrimitive.Markdown className="message-markdown space-y-4 [&_a]:text-accent [&_a]:underline [&_code]:rounded [&_code]:bg-bubble [&_code]:px-1 [&_code]:font-mono [&_code]:text-[15px] [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-bubble [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6" />
                            ) : null
                          }
                        </MessagePrimitive.Parts>
                      </MessagePrimitive.Content>
                    </div>
                  )}
                </MessagePrimitive.Root>
              </ThreadPrimitive.Messages>

              <ThreadPrimitive.Error className="text-sm text-red-600" />
            </div>
          </ThreadPrimitive.Viewport>

          <ComposerPrimitive.Root className="mx-auto w-full max-w-3xl px-4 pb-6">
            <div className="flex items-center gap-2 rounded-3xl border border-line bg-surface p-2 shadow-sm focus-within:shadow-md">
              <ComposerPrimitive.Input
                className="flex-1 bg-transparent px-3 py-2 leading-6 text-ink outline-none placeholder:text-muted"
                placeholder="Ask about variables, loops, functions..."
              />
              <ComposerPrimitive.Submit className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-white hover:opacity-90 disabled:opacity-40">
                ↑
              </ComposerPrimitive.Submit>
            </div>
          </ComposerPrimitive.Root>
        </ThreadPrimitive.Root>
      </ChatProvider>
    </main>
  );
}
