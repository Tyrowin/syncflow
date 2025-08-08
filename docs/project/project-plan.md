# Project Plan: SyncFlow

This document outlines the tasks required to build a full-stack, type-safe, real-time Kanban board application using Next.js, tRPC, Bun, Convex, and DaisyUI.

## Phase 1: Project Setup & Foundation

This phase focuses on initializing the Next.js project, installing all dependencies, and configuring the development environment.

### Task 1.1: Initialize Next.js Project and Tooling ✅ (Completed)

_Status: Completed on 2025-08-08._

**Purpose:** To create a stable foundation for the project with all the necessary tools and configurations in place, ensuring a smooth development workflow from the start.

**Subtasks:**

- Initialize a new Next.js project using `bunx create-next-app@latest` (TypeScript, ESLint, Tailwind CSS).
- Initialize git and create initial commit.
- Install and configure Prettier with ESLint.
- Add a `format` script to `package.json` to run Prettier.
- Install DaisyUI (`bun add -d daisyui`) and add it as a plugin in `tailwind.config.ts`.

**Definition of Done:**

- Next.js project created and committed.
- `bun install` installs all dependencies.
- `bun run lint` and `bun run format` run without errors.
- Project builds via `bun run build`.
- DaisyUI classes (e.g., `btn`, `card`) render correctly.

### Task 1.2: Set Up Convex Backend ✅ (Completed)

_Status: Completed on 2025-08-08._

**Purpose:** To integrate the Convex SDK and establish the initial connection between the local development environment and the Convex cloud backend.

**Subtasks:**

- Sign up for a Convex account.
- Run `npx convex dev` to initialize (creates `convex/` directory).
- Add Convex env var `NEXT_PUBLIC_CONVEX_URL` to `.env.local`.
- Ensure `.env.local` is in `.gitignore`.

**Definition of Done:** (Met)

- `convex/` directory with default schema/functions exists.
- Convex dashboard shows project connected (deployment: `amiable-starfish-861`).
- Next.js server reads Convex URL from env (`NEXT_PUBLIC_CONVEX_URL` present).
- Code compiles without errors (`bun run build` succeeded post-initialization).

## Phase 2: Core Backend with Convex

This phase focuses on defining the database schema and creating the core real-time functions for the Kanban board (frontend-agnostic).

### Task 2.1: Define Database Schema ✅ (Completed)

_Status: Completed on 2025-08-08._

**Purpose:** Model data for projects, columns, and tasks.

**Subtasks:**

- Open `convex/schema.ts`.
- Define `projects` table: `name` (string).
- Define `columns` table: `name` (string), `projectId` (id), `order` (number).
- Define `tasks` table: `title` (string), `description` (optional string), `columnId` (id), `order` (number).

**Definition of Done:**

- Schema defined in `convex/schema.ts`.
- `npx convex dev` pushes schema without errors.
- Dashboard shows `projects`, `columns`, `tasks`.
- Code compiles and passes lint.

### Task 2.2: Create Core Convex Queries and Mutations ✅ (Completed)

_Status: Completed on 2025-08-08._

**Purpose:** Provide API functions for real-time board operations.

**Subtasks:**

- Create `convex/tasks.ts`.
- Query: fetch tasks by `columnId`.
- Mutations: create task; update task (title, description); move task (update `columnId` and `order`).
- Create similar files/functions for projects and columns.

**Definition of Done:**

- All queries/mutations implemented.
- Manual function tests performed via Convex dashboard.
- Backend compiles and passes lint.

## Phase 3: Basic Frontend with Next.js

Set up frontend structure and initial Kanban UI.

### Task 3.1: Set Up Next.js App Router and Providers ✅ (Completed)

_Status: Completed on 2025-08-08._

**Purpose:** Establish routing and shared providers.

**Subtasks:**

- Create dynamic route `app/projects/[projectId]/page.tsx`.
- Create `ConvexClientProvider`.
- Wrap app in provider via `app/layout.tsx`.

**Definition of Done:**

- Dev server runs (`bun run dev`).
- `/projects/some-id` renders placeholder.
- `ConvexClientProvider` wired in root layout.
- Frontend compiles and lints clean.

### Task 3.2: Render Kanban Board UI

**Purpose:** Build visual components with mock data.

**Subtasks:**

- Create `ProjectBoard` (client component).
- Create `Column` and `TaskCard` (use DaisyUI `card`).
- Add "Add Task" button (`btn`) + modal (`modal`).
- Use mock columns and tasks.

**Definition of Done:**

- Board renders with mock data using DaisyUI.
- Responsive and visually correct.
- Basic tests for `Column` and `TaskCard` (Jest + RTL).
- Frontend compiles and lints clean.

## Phase 4: Real-time Collaboration

Connect UI to live Convex data.

### Task 4.1: Fetch and Display Real-time Data

**Purpose:** Replace mock data with live backend data.

**Subtasks:**

- In `ProjectBoard`, use `useQuery` for project columns.
- In `Column`, use `useQuery` for tasks.
- Ensure all Convex-hook components are client components.

**Definition of Done:**

- Board shows live Convex data.
- Dashboard changes reflect instantly.
- Proper loading and empty states.
- Code compiles and lints clean.

### Task 4.2: Implement Drag-and-Drop Task Movement

**Purpose:** Enable reordering tasks within/between columns.

**Subtasks:**

- Integrate `dnd-kit` (or similar).
- Wrap components with DnD providers/hooks.
- On drag end, call mutation to update `columnId` and `order`.

**Definition of Done:**

- Tasks draggable within and across columns.
- Changes persist and sync in real-time across clients.
- Manual E2E test across two windows passes.
- Code compiles and lints clean.

## Phase 5: tRPC for Auxiliary Actions

Introduce tRPC for non-real-time actions.

### Task 5.1: Set Up tRPC with Next.js API Routes

**Purpose:** Provide type-safe API layer inside Next.js.

**Subtasks:**

- Install tRPC dependencies.
- Create router, context, procedures.
- Add API handler: `app/api/trpc/[trpc]/route.ts`.
- Create client provider and add to `app/layout.tsx`.
- Add "hello world" procedure and call from component.

**Definition of Done:**

- tRPC API route operational.
- Frontend receives typed response.
- End-to-end type safety.
- Code compiles and lints clean.

### Task 5.2: Implement Email Notifications with tRPC

**Purpose:** Handle side-effect (sending email) outside real-time layer.

**Subtasks:**

- Add mutation `sendTaskAssignmentEmail`.
- Accept `taskId`, `userEmail`.
- Integrate email provider SDK (e.g., SendGrid, Resend).
- Invoke mutation on task assignment via generated hook.

**Definition of Done:**

- Assigning task triggers mutation.
- Email sent (verified via provider logs).
- Integration test performed.
- Code compiles and lints clean.
