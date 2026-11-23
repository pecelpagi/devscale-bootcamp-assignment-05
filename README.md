# Study Buddy

Socratic study tutor for intro programming. Monorepo: `apps/api` (Hono), `apps/web` (Vite + React), `packages/agents` (Anvia agent), `packages/db` (Drizzle + Postgres).

## Setup
```bash
cp .env.example .env        # fill LLM_API_KEY, LLM_BASE_URL (OpenAI-compatible), TAVILY_API_KEY
docker compose -f docker-compose.dev.yaml up -d
pnpm install
pnpm db:migrate
pnpm dev:api                # http://localhost:3000
pnpm dev:web                # http://localhost:5173
pnpm evals                  # needs LLM credentials
```
`LLM_MODEL` defaults to `deepseek-v4-flash-0731`. Lens tracing is off unless `ANVIA_LENS_PUBLIC_KEY` and `ANVIA_LENS_SECRET_KEY` are set.
