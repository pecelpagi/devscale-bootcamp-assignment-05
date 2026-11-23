import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

type SessionSummary = {
  id: string;
  updatedAt: string;
  title: string;
};

export const Route = createRootRoute({
  loader: async () => {
    const res = await fetch("/api/sessions");
    if (!res.ok) throw new Error(`Failed to load sessions: ${res.status}`);
    return { sessions: (await res.json()) as SessionSummary[] };
  },
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="flex h-screen bg-page text-ink">
      <Sidebar />
      <Outlet />
    </div>
  );
}

function Sidebar() {
  const { sessions } = Route.useLoaderData();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-side p-3 text-sm text-ink md:flex">
      <div className="flex items-center gap-2 px-2 py-2 font-serif-body text-lg">
        <span className="text-xl leading-none text-accent">✻</span>
        Study Buddy
      </div>

      <Link
        to="/"
        className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-accent hover:bg-black/5 dark:hover:bg-white/5"
      >
        <span className="text-lg leading-none">+</span>
        New chat
      </Link>

      <p className="mt-6 px-3 text-xs font-medium text-muted">Recents</p>
      <nav className="mt-2 flex flex-col gap-0.5 overflow-y-auto">
        {sessions.map((session) => (
          <Link
            key={session.id}
            to="/s/$id"
            params={{ id: session.id }}
            className="truncate rounded-lg px-3 py-2 text-ink/80 hover:bg-black/5 dark:hover:bg-white/5"
            activeProps={{ className: "truncate rounded-lg bg-black/10 px-3 py-2 text-ink dark:bg-white/10" }}
          >
            {session.title}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-2 rounded-lg px-3 py-2">
        <span className="flex size-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
          D
        </span>
        <span className="truncate text-muted">default-user</span>
      </div>
    </aside>
  );
}
