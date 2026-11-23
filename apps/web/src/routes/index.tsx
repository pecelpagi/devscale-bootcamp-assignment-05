import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

declare module "@tanstack/react-router" {
  interface HistoryState {
    pendingMessage?: string;
  }
}

export const Route = createFileRoute("/")({
  component: NewChat,
});

// New chat: the composer only. The first message is sent from the session page.
function NewChat() {
  const navigate = useNavigate();
  const [text, setText] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = text.trim();
    if (!message) return;

    const id = crypto.randomUUID();
    void navigate({ to: "/s/$id", params: { id }, state: { pendingMessage: message } });
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <h1 className="mb-8 flex items-center gap-3 font-serif-body text-4xl text-ink">
          <span className="text-4xl leading-none text-accent">✻</span>
          What do you want to study today?
        </h1>

        <form onSubmit={submit} className="w-full max-w-2xl">
          <div className="flex items-center gap-2 rounded-3xl border border-line bg-surface p-3 shadow-sm focus-within:shadow-md">
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="flex-1 bg-transparent px-3 py-3 text-base leading-6 text-ink outline-none placeholder:text-muted"
              placeholder="Ask about variables, loops, functions..."
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-white hover:opacity-90 disabled:opacity-40"
            >
              ↑
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
