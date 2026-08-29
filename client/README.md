# Quizora: Learn, Play & Score

**Test Your Knowledge. Master Your Future.**

Quizora is a professional quiz platform with a React client and one client-hosted quiz API.

## Architecture

- `client/` contains the client application, TanStack routes, UI components, API client, Supabase client configuration, quiz banks, scoring, certificates, and API handlers.
- `server/` is kept as a separate standalone Fastify/PostgreSQL option, but the client does not use it. All quiz requests use the client-hosted `/api/*` routes.
- Root configuration files support both applications without mixing their source code.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

All quiz, result, leaderboard, certificate, and account requests use the PostgreSQL Fastify API. Set `VITE_API_URL` to its public VPS URL before building the client.

### PostgreSQL server setup

The `../server/` folder contains the Fastify/PostgreSQL API. It reads `DATABASE_URL` from the server environment:

```sh
psql "$DATABASE_URL" -f ../server/migrations/001_initial.sql
psql "$DATABASE_URL" -f ../server/migrations/002_auth.sql
```

For a VPS, set `CLIENT_ORIGIN` to the deployed client URL, then run `npm run build` and `npm start` from `../server`. Keep `DATABASE_URL` in the server environment only; it must never be exposed through a `VITE_` variable.
