# AI Course Tutor

A small Next.js app for managing course lessons and asking an AI tutor questions about them. The tutor uses retrieval-augmented generation (RAG): each lesson is embedded with [Voyage AI](https://www.voyageai.com/), the lessons most relevant to a question are retrieved by cosine similarity, and [Claude](https://www.anthropic.com/claude) answers using only those lessons.

## Features

- Create, edit, and delete lessons (title + content, validated with Zod)
- Lessons are stored in a local SQLite database via Drizzle ORM
- An embedding vector is generated for each lesson when it is created
- "Ask the tutor" finds the 2 most relevant lessons and answers from their content only. If the answer isn't in the material, the tutor says so.

## Tech stack

| Area       | Tool                                                   |
| ---------- | ------------------------------------------------------ |
| Framework  | Next.js 16 (App Router, Server Actions), React 19      |
| Database   | SQLite via `@libsql/client` + Drizzle ORM / drizzle-kit |
| Embeddings | Voyage AI (`voyage-4`)                                 |
| LLM        | Anthropic Claude (`claude-haiku-4-5`)                  |
| Validation | Zod                                                    |
| Styling    | CSS Modules + Tailwind CSS 4                           |

## Getting started

### Prerequisites

- Node.js 20+
- An [Anthropic API key](https://console.anthropic.com/)
- A [Voyage AI API key](https://dash.voyageai.com/)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
ANTHROPIC_API_KEY=your-anthropic-key
VOYAGE_API_KEY=your-voyage-key
```

`.env*` files are git-ignored.

### 3. Set up the database

The app uses a local SQLite file, `sqlite.db` (git-ignored), in the project root. Apply the migrations to create it:

```bash
npx drizzle-kit migrate
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Start the development server  |
| `npm run build` | Build for production          |
| `npm run start` | Start the production server   |
| `npm run lint`  | Run ESLint                    |

## How it works

1. **Adding a lesson.** `createLesson` in [app/actions.ts](app/actions.ts) validates the form, calls `embed()` from [lib/embeddings.ts](lib/embeddings.ts) to get a vector for the lesson content, and saves the lesson with its embedding stored as a JSON string.
2. **Asking a question.** `askTutor` embeds the question, loads all lessons, and ranks them with `findTopLessons` from [lib/retrieval.ts](lib/retrieval.ts) (cosine similarity, top 2).
3. **Answering.** The selected lessons are placed in the prompt as context, and Claude is told to answer only from that material. The prompt is in Hebrew.

## Project structure

```
app/
  actions.ts          Server Actions: create/update/delete lessons, askTutor
  page.tsx            Home page: lesson list + tutor panel
  components/         Lesson form/card/create, delete button, tutor UI
db/
  index.ts            Drizzle client (file:sqlite.db)
  schema.ts           `lessons` table schema
drizzle/              Generated SQL migrations
lib/
  embeddings.ts       Voyage AI embedding helper
  retrieval.ts        Cosine similarity + top-N lesson retrieval
drizzle.config.ts     drizzle-kit config
```

## Changing the schema

After editing [db/schema.ts](db/schema.ts), generate and apply a migration:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Known limitations

- **Editing doesn't re-embed.** `updateLesson` doesn't regenerate the embedding, so after you edit a lesson's content, retrieval still uses the vector from the original content.
- **Retrieval runs in memory.** Every question loads all lessons and their vectors from the database. This is fine for a small course but won't scale to a large one; a vector index would be needed.
- **Existing rows and the `embedding` column.** Migration `0002` adds `embedding` as `NOT NULL`. On a database that already has lessons, you may need to clear the table or backfill embeddings before this migration will apply.
