# StudyMate MCP Server

A standalone Model Context Protocol (MCP) server that exposes StudyMate's notes directly to MCP-compatible LLM clients (e.g. Claude Desktop) over `stdio`. It connects straight to the MongoDB database used by the rest of the app — the Express API does not need to be running for this to work.

## Setup

```bash
cd mcp-server
npm install
cp .env.example .env   # then fill in MONGODB_URI
npm start
```

`MONGODB_URI` should point at the same database StudyMate's `server/` uses, so notes created or listed here show up in the web app too (and vice versa).

## Tools

| Tool | Arguments | Description |
| --- | --- | --- |
| `list_notes` | none | Lists all notes (title, subject, content, creation date) as formatted text. |
| `create_note` | `title`, `subject`, `content` (all required strings) | Creates a new note and returns a confirmation with its id. |

## Claude Desktop Integration

Add the following to your `claude_desktop_config.json` (find it via Claude Desktop → Settings → Developer → Edit Config), replacing the path with the absolute path to `index.js` on your machine and the connection string with your real MongoDB URI:

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

Restart Claude Desktop after saving. Then try:

- *"What notes do I have currently?"*
- *"Add a note about React hooks lifecycle functions."*
