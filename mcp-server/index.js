import 'dotenv/config';
import mongoose from 'mongoose';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import Note from './models/Note.js';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  process.stderr.write('MONGODB_URI is not set. Please configure it in your environment.\n');
  process.exit(1);
}

// Connect lazily: tool handlers await this shared promise before querying,
// so the stdio handshake with the MCP client isn't blocked on DB availability.
const dbReady = mongoose.connect(MONGODB_URI);
dbReady.catch((err) => {
  process.stderr.write(`MongoDB connection error: ${err.message}\n`);
});

const server = new McpServer({
  name: 'studymate-mcp-server',
  version: '1.0.0',
});

server.registerTool(
  'list_notes',
  {
    title: 'List Notes',
    description:
      'Lists all study notes currently stored in StudyMate, including title, subject, content, and creation date.',
  },
  async () => {
    try {
      await dbReady;
      const notes = await Note.find().sort({ createdAt: -1 });

      if (notes.length === 0) {
        return { content: [{ type: 'text', text: 'No notes found in StudyMate yet.' }] };
      }

      const formatted = notes
        .map((note, index) => {
          const created = note.createdAt.toISOString().split('T')[0];
          return `${index + 1}. [${note.subject}] ${note.title} (created ${created})\n   ${note.content}`;
        })
        .join('\n\n');

      return {
        content: [{ type: 'text', text: `Found ${notes.length} note(s):\n\n${formatted}` }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Failed to list notes: ${err.message}` }],
        isError: true,
      };
    }
  },
);

server.registerTool(
  'create_note',
  {
    title: 'Create Note',
    description: 'Creates a new study note in StudyMate with a title, subject, and content.',
    inputSchema: {
      title: z.string().min(1).describe('The title of the note.'),
      subject: z.string().min(1).describe('The subject or category of the note, e.g. Biology.'),
      content: z.string().min(1).describe('The full text content of the note.'),
    },
  },
  async ({ title, subject, content }) => {
    try {
      await dbReady;
      const note = await Note.create({
        title: title.trim(),
        subject: subject.trim(),
        content: content.trim(),
      });

      return {
        content: [
          {
            type: 'text',
            text: `Created note "${note.title}" (${note.subject}) with id ${note._id}.`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Failed to create note: ${err.message}` }],
        isError: true,
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write('StudyMate MCP server running on stdio\n');
}

main().catch((err) => {
  process.stderr.write(`Fatal error starting MCP server: ${err.message}\n`);
  process.exit(1);
});
