# Socket IO Server (with optional React client)

This repository contains an Express + Socket.IO server. It is set up so you can
either run the React app separately during development (recommended) or build
and serve the client from the same server in production.

Quick setup

- Place an existing React app in `client/` (for Vite React apps this is natural).
- During development run the client with its dev server (Vite runs on 5173 by
  default) and run the server locally on port 3000.

Scripts

- `npm run dev` — runs both server and client concurrently (server with `tsx`, client via `client`'s `dev` script).
- `npm run build-client` — runs `npm run build` inside `client/` (produces `client/dist`).
- `npm start` — runs the server with `NODE_ENV=production` (serves `client/dist` if present).

How it works

- Development: the server keeps a permissive CORS policy for `http://localhost:5173` so Vite's dev server can connect to Socket.IO at `http://localhost:3000`.
- Production: when `NODE_ENV=production` the Express server serves static files from `client/dist` and falls back to `index.html` for client-side routing. This lets you review and run both client and server code from the same repo.

Example local workflow

1. Copy or move your React app into `client/` (or add it as a Git submodule).
2. From repository root install deps: `npm install` and then `cd client && npm install`.
3. Start both during development:

```powershell
npm run dev
```

4. To produce a production bundle and run the server serving the bundle:

```powershell
npm run build-client
npm start
```

Notes and pointers

- Client dist path: `client/dist` (Vite default). If your client build directory differs, update `index.ts`.
- Socket handlers are in `socket.ts` and type definitions are in `types.ts`.
- If you'd like, I can move an existing React app into `client/` for you and wire up the client `package.json` change — tell me where your current app lives.

Deploying to Render

- Quick (current repo layout): Build the client and run the server with `tsx` at runtime.

  - Render Build Command: `npm run build-client`
  - Render Start Command: `NODE_ENV=production tsx index.ts`
  - Notes: this repository already has `tsx` moved to `dependencies` so Render will have it available. Render provides the `PORT` environment variable automatically and `index.ts` reads `process.env.PORT`.

- Production-friendly (compile server): build client and compile server to JS, then run with Node.
  - Add a server build (example scripts):
    - `"build-client": "npm --prefix client run build"`
    - `"build-server": "tsc -p tsconfig.build.json"`
    - `"build": "npm run build-client && npm run build-server"`
    - `"start": "NODE_ENV=production node dist/index.js"`
  - Render Build Command: `npm run build` (will run client + server builds)
  - Render Start Command: `npm start`

Common issues

- `tsx: command not found` — make sure `tsx` is in `dependencies` (not only `devDependencies`) or use the compiled-server approach.
- `client/dist` missing on start — ensure the build step runs and produces `client/dist` (Vite default). Use the `build` option above to guarantee creation before start.
- CORS/connect errors during dev do not apply in production; the server serves the client statically in production and client and server share origin.

If you want, I can add the `tsconfig.build.json` and `build-server` script (compile-server approach) and test a local production run. Which deployment approach do you prefer?
