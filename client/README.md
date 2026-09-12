# Quitech: Learn, Challenge & Progress

**Learn, challenge & progress.**

Quitech is a professional quiz platform with a React client and API routes for quiz catalogue, results, leaderboards, certificates, and accounts.

## Architecture

- `client/` contains the client application, TanStack routes, UI components, API client, Supabase client configuration, quiz banks, scoring, certificates, and API handlers.
- `server/` contains the Fastify/PostgreSQL API for accounts and persistent data. Web requests use the client-hosted `/api/*` proxy; native apps call the API directly.
- Root configuration files support both applications without mixing their source code.

## Development

Prefer working locally? You need Node.js and npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

Set `SERVER_API_URL` in the frontend server environment (or `VITE_API_URL` in `client/.env` at build time) to the Fastify API URL. For local backend development, use `http://localhost:3001`. Web requests stay on `/api`; native apps use `VITE_API_URL`. Account features require the PostgreSQL API.

Run `npm --prefix client test` from the repository root for authentication regression tests. These exercise the real client and Fastify handlers with an in-memory database substitute; they do not contact production.

### PostgreSQL server setup

The `../server/` folder contains the Fastify/PostgreSQL API. It reads `DATABASE_URL` from the server environment:

```sh
psql "$DATABASE_URL" -f ../server/migrations/001_initial.sql
psql "$DATABASE_URL" -f ../server/migrations/002_auth.sql
```

For a VPS, set `CLIENT_ORIGIN` to the deployed client URL, then run `npm run build` and `npm start` from `../server`. Keep `DATABASE_URL` in the server environment only; it must never be exposed through a `VITE_` variable.
