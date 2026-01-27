# CodeBase Analyzer

## Overview

CodeBase Analyzer is a web application that analyzes GitHub repositories to extract comprehensive documentation. Users can input a GitHub repository URL, and the system fetches and processes the repository structure including folder hierarchies, files, functions, git commit history, and module dependencies. The analyzed data is presented through an interactive dashboard with file tree navigation, detailed file/function views, commit history, and dependency graphs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing with two main routes (Home and Analysis)
- **State Management**: TanStack React Query for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives with Tailwind CSS
- **Typography**: Inter for UI elements, JetBrains Mono for code display (developer-focused design)
- **Layout Pattern**: 3-column dashboard layout with collapsible sidebars for repository navigation

### Backend Architecture
- **Framework**: Express.js running on Node.js with TypeScript
- **API Structure**: RESTful endpoints under `/api/` prefix
- **Development Server**: Vite dev server with HMR proxied through Express
- **Production Build**: esbuild bundles server code, Vite builds client assets to `dist/public`

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**: repositories, folders, files, functions, commits, moduleDependencies, users
- **Validation**: Zod schemas generated from Drizzle schemas using drizzle-zod
- **Storage Interface**: Abstract IStorage interface in `server/storage.ts` for data operations

### Key Design Patterns
- **Monorepo Structure**: Client code in `client/`, server in `server/`, shared types in `shared/`
- **Path Aliases**: `@/` maps to client source, `@shared/` maps to shared directory
- **Type Safety**: Full TypeScript coverage with shared types between frontend and backend
- **Component Architecture**: Feature components (FileTree, GitHistory, DependencyGraph) with atomic UI components

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations stored in `migrations/` directory

### GitHub Integration
- GitHub REST API for fetching repository data (repos, trees, commits, file contents)
- No authentication token required for public repositories (rate-limited)
- **Rate Limiting & Retry Logic** (server/github-client.ts):
  - 100ms delay between requests to prevent rate limiting
  - Exponential backoff retry (1s to 30s max) with jitter
  - 5 max retries per failed request
  - Handles socket errors (UND_ERR_SOCKET), rate limits (403/429), and server errors (5xx)
  - Batch processing with 50 files per batch and 500ms between batches

### Version-Aware Architecture (Added January 2026)
- **Database Schema Extensions** (shared/schema.ts):
  - `commits` table enhanced with `tag`, `isLatest`, `isIndexed` fields
  - `file_versions` table: stores file snapshots per commit
  - `function_versions` table: stores function-level snapshots per file version
- **Version-Aware Storage** (server/storage.ts):
  - Methods for creating/querying file and function versions
  - Search functions by keyword with version filtering
  - Get file by path and version
- **Search & Diff APIs** (server/routes.ts):
  - `GET /api/search/functions?keyword=X&version=v4.1&repositoryId=Y`
  - `GET /api/file?path=src/file.ts&version=latest&repositoryId=Y`
  - `GET /api/diff?file=file.ts&from=v4.0&to=v4.1&repositoryId=Y`
  - `GET /api/repositories/:id/versions` - list indexed versions

### LLM Integration for Function Analysis (Added January 2026)
- **AI Provider**: OpenAI via Replit AI Integrations (no API key needed, billed to credits)
- **Model**: GPT-4o (OpenAI's most powerful model) for high-quality function analysis
- **Batch Processing** (server/llm-analysis.ts):
  - Parallel processing with concurrency limit (3 concurrent requests)
  - Automatic retry with exponential backoff for rate limits
  - Progress streaming via SSE for real-time UI updates
- **Function Schema Extensions**:
  - `aiPurpose`: What the function does
  - `aiHowItHelps`: How it contributes to the project
  - `aiInputOutput`: Summary of inputs and outputs
  - `aiComplexity`: simple | moderate | complex
  - `aiAnalyzedAt`: Timestamp of analysis
- **API Endpoints**:
  - `POST /api/repositories/:id/analyze-functions` - Trigger AI analysis (SSE streaming)
  - `GET /api/repositories/:id/ai-analysis` - Get AI analysis status and results
  - `GET /api/repositories/:id/ai-analysis/download` - Download analysis as JSON file
- **UI Component** (client/src/components/ai-analysis.tsx):
  - Progress dialog with real-time function-by-function updates
  - Error handling and retry support

### UI Framework Dependencies
- **Radix UI**: Full suite of accessible primitive components (dialogs, dropdowns, tabs, etc.)
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **date-fns**: Date formatting for commit history display

### Build & Development
- **Vite**: Frontend bundling with React plugin and Replit-specific plugins
- **esbuild**: Server-side bundling for production
- **tsx**: TypeScript execution for development server