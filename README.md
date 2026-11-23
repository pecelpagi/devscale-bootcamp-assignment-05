# Study Buddy

Socratic study tutor for intro programming. Chat with an AI agent that answers with web search, keeps each conversation in Postgres, and lists past sessions in a sidebar.

## Tech stack

- **Web:** Vite, React 19, TanStack Router, Tailwind CSS 4, Anvia React UI
- **API:** Hono on Node, run with `tsx`
- **Agent:** Anvia (`@anvia/core`) with an OpenAI-compatible model and Tavily web search
- **Database:** Postgres 16, Drizzle ORM and drizzle-kit
- **Observability (optional):** self-hosted Anvia Lens
- **Tooling:** pnpm workspaces

## Repo structure

```
apps/
  api/          Hono server: /chat (streaming), /sessions, /sessions/:id/messages
  web/          Vite + React app (routes: / new chat, /s/$id session)
packages/
  agents/       Study Buddy agent: instructions, context, web-search tool, Lens tracing, evals
  db/           Drizzle schema, migrations and Postgres client
infra/
  lens/         Docker Compose stack for self-hosted Anvia Lens
docker-compose.dev.yaml   Local Postgres for development
```

## Prerequisites

- Node.js (with `--env-file-if-exists` support) and pnpm 11.23.0 (pinned in `package.json`)
- Docker
- An OpenAI-compatible LLM endpoint and a Tavily API key

## Setup

```bash
cp .env.example .env
docker compose -f docker-compose.dev.yaml up -d   # Postgres on localhost:5545
pnpm install
pnpm db:migrate
```

Environment variables (`.env`):

| Variable | Meaning |
| --- | --- |
| `DATABASE_URL` | Postgres connection string. The default matches the dev compose file. |
| `LLM_API_KEY` | API key for the chat completions endpoint. |
| `LLM_BASE_URL` | OpenAI-compatible endpoint URL. |
| `LLM_MODEL` | Optional. Defaults to `deepseek-v4-flash-0731`. |
| `TAVILY_API_KEY` | Key for the web search tool. |
| `ANVIA_LENS_BASE_URL`, `ANVIA_LENS_PUBLIC_KEY`, `ANVIA_LENS_SECRET_KEY` | Optional. Tracing is off unless the keys are set. |
| `ANVIA_LENS_SERVICE_NAME`, `ANVIA_LENS_ENVIRONMENT` | Optional labels for Lens traces. |

## Run

```bash
pnpm dev:api    # API on http://localhost:3000 (override with PORT)
pnpm dev:web    # Web on http://localhost:5173, proxies /api to the API
```

Other scripts:

```bash
pnpm build        # build all workspaces
pnpm typecheck    # typecheck all workspaces
pnpm db:generate  # generate a Drizzle migration after schema changes
pnpm db:migrate   # apply migrations
```

## How it works

```
web  --/api/chat-->  api  -->  agents (runAgent)  -->  LLM + Tavily search
                      |
                      +--> db (Postgres: conversation memory)
```

- The web app sends the latest message to `POST /chat?sessionId=...` and streams the reply.
- The API runs the agent with a Drizzle-backed memory store. Memory saves the conversation per session, so only the newest user message is sent each turn.
- `GET /sessions` and `GET /sessions/:id/messages` feed the sidebar and prefill the chat.
- There is a single hard-coded user (`default-user`); there is no auth yet.
- If Lens keys are set, the agent sends full traces to Anvia Lens. `infra/lens/docker-compose.yml` runs Lens locally and needs `PUBLIC_APP_URL`, `WEB_ORIGIN`, `POSTGRES_PASSWORD`, `CLICKHOUSE_PASSWORD`, `REDIS_PASSWORD`, `BETTER_AUTH_SECRET`, `INGESTION_KEY_PEPPER` and `LENS_ALERT_SECRET_KEY` in its environment.

## Evals

```bash
pnpm evals    # runs packages/agents/src/evals/tutor.ts; needs LLM credentials
```
