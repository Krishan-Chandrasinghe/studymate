# StudyMate — Your AI-Powered Study Notes App

StudyMate is a full-stack study notes app: a landing page, a React client, an Express + MongoDB API, an Anthropic Claude-powered AI layer for summaries and quizzes, and a Model Context Protocol (MCP) server that lets Claude Desktop read and write your notes directly.

**Live client:** [PENDING — production Vercel URL]

## Table of Contents

- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Environment Configuration](#environment-configuration)
- [Setup & Local Development](#setup--local-development)
- [Claude Desktop / MCP Integration](#claude-desktop--mcp-integration)
- [Deployment](#deployment)
- [Verification Gallery](#verification-gallery)

## Tech Stack

| Layer | Technology |
| --- | --- |
| Landing page | Semantic HTML5, custom CSS3 (Flexbox/Grid), vanilla JavaScript |
| Client | React 19, Vite, vanilla CSS (no UI framework) |
| Server | Node.js, Express 5 |
| Database | MongoDB via Mongoose |
| AI engine | Anthropic Claude API (`@anthropic-ai/sdk`), model `claude-opus-4-8` |
| MCP server | `@modelcontextprotocol/sdk` over `stdio`, Zod for tool input validation |
| Deployment | Vercel (client) |

## Repository Structure

```
├── landing/          # Part 1 — Pure HTML/CSS/JS marketing/landing page
│   ├── index.html
│   ├── style.css
│   └── script.js
├── client/           # Part 2 — React app (Vite)
│   └── src/
│       ├── api/notes.js         # fetch client for the notes API
│       ├── components/          # NoteForm, NoteCard, Quiz
│       └── App.jsx
├── server/           # Parts 3 & 4 — Express + MongoDB + AI integration
│   ├── models/Note.js
│   ├── routes/notes.js
│   ├── middleware/validateNote.js
│   ├── services/anthropicService.js
│   ├── scripts/seedNotes.js
│   └── server.js
├── mcp-server/       # Part 5 — Model Context Protocol server (stdio)
│   ├── models/Note.js
│   └── index.js
└── README.md         # Part 6 — this file
```

## Environment Configuration

### `server/.env` (copy from `server/.env.example`)

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No (defaults to `5000`) | Port the Express API listens on. |
| `MONGODB_URI` | Yes | MongoDB connection string. Same database is shared with `mcp-server/`. |
| `ANTHROPIC_API_KEY` | Yes (for AI features) | Anthropic API key used by `services/anthropicService.js` to generate note summaries and quizzes. Get one from [console.anthropic.com](https://console.anthropic.com). Without it, everything except `POST /api/notes/:id/summarize` still works. |
| `OPENAI_API_KEY` | No | Reserved for an alternative AI provider; not currently used by any route. Safe to leave blank. |
| `CLIENT_ORIGIN` | Yes | Comma-separated list of allowed CORS origins for the client (e.g. `http://localhost:5173,https://your-app.vercel.app`). Any `*.vercel.app` origin is also allowed automatically for preview deployments. |

### `mcp-server/.env` (copy from `mcp-server/.env.example`)

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | Same MongoDB connection string as `server/.env` — the MCP server talks to the database directly, independent of the Express API. |

### `client/`

No `.env` is required to run locally (it defaults to `http://localhost:5000`). To point the client at a different API base URL, create `client/.env` with:

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | No (defaults to `http://localhost:5000`) | Base URL the client uses for all `/api/notes` requests. |

## Setup & Local Development

Each layer runs independently. Run them in separate terminals.

### 1. Server (Express + MongoDB + AI)

```bash
cd server
npm install
cp .env.example .env   # fill in MONGODB_URI and ANTHROPIC_API_KEY
npm run dev
```

Optional: seed 5 sample notes across different subjects:

```bash
npm run seed
```

### 2. Client (React + Vite)

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

### 3. Landing page

Pure static files — open `landing/index.html` directly in a browser, or serve the folder with any static file server.

### 4. MCP server (for Claude Desktop)

```bash
cd mcp-server
npm install
cp .env.example .env   # fill in MONGODB_URI
```

See [Claude Desktop / MCP Integration](#claude-desktop--mcp-integration) below to connect it.

## Claude Desktop / MCP Integration

The MCP server (`mcp-server/index.js`) exposes two tools — `list_notes` and `create_note` — directly to Claude Desktop over `stdio`, independent of whether the Express server is running.

1. Open Claude Desktop → **Settings → Developer → Edit Config** to locate `claude_desktop_config.json`.
2. Add a `studymate-mcp` entry, using the **absolute path** to `mcp-server/index.js` on your machine:

   ```json
   {
     "mcpServers": {
       "studymate-mcp": {
         "command": "node",
         "args": ["/absolute/path/to/studymate/mcp-server/index.js"],
         "env": {
           "MONGODB_URI": "your_mongodb_connection_string_here"
         }
       }
     }
   }
   ```

3. Restart Claude Desktop.
4. Verify the connection by asking:
   - *"What notes do I have currently?"*
   - *"Add a note about React hooks lifecycle functions."*

## Deployment

### Client → Vercel

```bash
cd client
vercel        # first-time project setup
vercel --prod # ship to production
```

**Live client:** [PENDING — production Vercel URL]

### Backend

The Express API is designed to run wherever you have Node.js and network access to your MongoDB instance — locally, on a VPS, or on a platform like Render. Whichever URL it's reachable at, add it (and your deployed client's origin) to `CLIENT_ORIGIN` in `server/.env` so CORS allows the live client to call it. Any `*.vercel.app` preview origin is already allowed automatically.

> **Note:** if the backend is only running locally, a publicly deployed client can render the UI but can't reach `localhost` from another machine — API calls will fail until the backend is also reachable from the internet.

## Verification Gallery

| Capture | Preview |
| --- | --- |
| Main notes panel | [PENDING — screenshot] |
| AI summary + quiz scoring | [PENDING — screenshot] |
| Claude Desktop using `list_notes` / `create_note` | [PENDING — screenshot] |
