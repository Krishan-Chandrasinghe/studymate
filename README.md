# StudyMate — Your AI-Powered Study Notes App

StudyMate helps students capture, organize, and understand their study notes with the help of AI — summarizing material, answering questions about it, and surfacing it back through a Claude-connected MCP server.

This repository is being built incrementally, part by part.

## Repository Structure

```
├── landing/       # Part 1 — Pure HTML/CSS/JS marketing/landing page
│   ├── index.html
│   ├── style.css
│   └── script.js
├── client/        # Part 2 — React app (Vite)
├── server/        # Parts 3 & 4 — Express + MongoDB + AI integration
│   ├── server.js
│   └── .env.example
├── mcp-server/    # Part 5 — Model Context Protocol server (stdio)
│   └── index.js
└── README.md      # Part 6 — this file
```

- **`landing/`** — Static landing page built with plain HTML/CSS/JS.
- **`client/`** — React frontend built with Vite & JavaScript.
- **`server/`** — Node.js/Express API with Mongoose (MongoDB) and OpenAI/Anthropic AI integration.
- **`mcp-server/`** — Model Context Protocol server exposing StudyMate over `stdio` for Claude.

## Status

Scaffolding stage — directory structure and environment boilerplate only. Application code lands in subsequent parts.
