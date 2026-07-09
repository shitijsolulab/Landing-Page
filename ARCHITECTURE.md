# Frontend Architecture — Industry AI OS Workspace

The **authenticated enterprise application** (the "AI OS Workspace") that every future
industry reuses. This is the front end for the Industry AI OS backend platform. It is
**industry-neutral** — no Construction / Legal / Insurance / Healthcare logic lives
here. Industries plug in later as configuration, never as forks.

Design language: **Microsoft Copilot / Dynamics 365 / ServiceNow** — calm, dense,
neutral, production-focused. No futuristic UI.

> Backend counterpart: see the platform repo's `docs/ARCHITECTURE.md`. This document
> covers the frontend only.

---

## 1. Tech stack (nothing extra added)

| Concern | Choice | Notes |
|---|---|---|
| Framework | **React 19 + TanStack Start** (SSR) | existing project |
| Language | **TypeScript** | strict |
| Routing | **TanStack Router** (file-based) | `src/routes/*` |
| Server state | **TanStack Query** | caching, loading/error, refetch |
| App state | **React Context** | session + theme only |
| UI primitives | **shadcn/ui** (`src/components/ui/*`) | reused, not rebuilt |
| Styling | **Tailwind CSS v4** + CSS-variable tokens | class-based dark mode |
| Icons | **lucide-react** | |
| Toasts | **sonner** | |
| Build tool | **Vite** (via `@lovable.dev/vite-tanstack-config`) | |

No Redux/Zustand/axios were added — the platform already ships everything needed.

## 2. The one rule: the frontend talks only to the gateway

Every network call goes to the **API gateway** (`VITE_API_URL`, default
`http://localhost:8000`). The frontend never calls a backend service or Keycloak
directly. Auth is a bearer token stored in `localStorage`; the tenant is derived by
the backend from the JWT and is never set by the client.

**No mock business APIs.** If a screen has no backend endpoint yet, it has no API
method and renders an honest empty state (see §8, gaps).

## 3. Folder structure

```
src/
├── routes/                      # file-based routes (TanStack)
│   ├── __root.tsx               # SSR shell + QueryClientProvider
│   ├── index.tsx                # public marketing landing page (+ login modal)
│   ├── app.tsx                  # AUTH LAYOUT: guard + Theme/Session providers + sidebar + header + <Outlet/>
│   ├── app.index.tsx            # Dashboard  (/app)
│   ├── app.assistant.tsx        # AI Assistant (/app/assistant)
│   ├── app.documents.tsx        # Documents
│   ├── app.workflows.tsx        # Workflows
│   ├── app.approvals.tsx        # Approvals
│   ├── app.knowledge.tsx        # Knowledge search
│   ├── app.connectors.tsx       # Connector Hub
│   ├── app.analytics.tsx        # Analytics
│   ├── app.settings.tsx         # Settings
│   ├── app.admin.tsx            # Admin (RBAC-gated)
│   └── routeTree.gen.ts         # AUTO-GENERATED — do not edit by hand
├── lib/
│   ├── api.ts                   # typed gateway client (one method per endpoint)
│   ├── session.tsx              # SessionProvider + useSession() + RBAC helpers
│   ├── theme.tsx                # ThemeProvider + useTheme() (light/dark)
│   ├── industries.ts            # marketing landing content (not used by the app)
│   └── utils.ts                 # cn() classname helper
├── components/
│   ├── ui/                      # shadcn primitives (Button, Card, Table, DropdownMenu, …)
│   ├── layout/
│   │   ├── nav.ts               # sidebar nav config (single source of truth)
│   │   ├── AppSidebar.tsx       # sidebar (desktop rail + mobile drawer, RBAC filtered)
│   │   └── AppHeader.tsx        # org selector, search, notifications, theme, user menu
│   └── common/
│       ├── PageHeader.tsx       # page title + actions
│       ├── StatCard.tsx         # dashboard KPI tile
│       ├── StatusBadge.tsx      # status → colored pill
│       ├── DataTable.tsx        # generic typed table (loading/empty/error built in)
│       └── states.tsx           # LoadingState / EmptyState / ErrorState
├── styles.css                   # Tailwind + tokens; `.app-shell` enterprise theme
└── ...
```

## 4. Routing & the layout

- `app.tsx` is a **layout route**: it renders the sidebar + header + `<Outlet/>` and
  wraps children in `ThemeProvider` and `SessionProvider`. Every `/app/*` page renders
  inside it.
- Child pages are flat files: `app.documents.tsx` → `/app/documents`, etc.
- `app.index.tsx` is the index route for `/app` (the Dashboard).
- **Auth guard**: `app.tsx` redirects to `/` if there's no token; `SessionProvider`
  redirects if `/me` fails (expired/invalid token).
- Adding a page = add `app.<name>.tsx` + a `NAV` entry in `components/layout/nav.ts`.
  The route tree regenerates automatically on `npm run dev`.

## 5. Authentication & session

1. Login happens on the landing page (`index.tsx`) via `api.login(email, password)` →
   `POST /auth/token` → stores the access token → navigates to `/app`.
2. Inside the app, `SessionProvider` calls `GET /api/identity/me` once and exposes:
   `me` (`user_id`, `email`, `tenant_id`, `tenant_slug`, `roles`), `hasRole(...)`, and
   `isManager` (owner/admin).
3. **RBAC**: the Admin nav item and route are hidden/blocked unless `isManager`.
4. Sign out clears the token + query cache and returns to `/`.

## 6. Theme

- Enterprise palette (neutral slate + professional blue) is defined on a `.app-shell`
  class in `styles.css`, with a `.app-shell.dark` variant. Scoping it means the
  marketing landing page keeps its own look.
- `ThemeProvider` stores `light`/`dark` in `localStorage` (seeded from OS preference);
  the layout applies the `dark` class to the shell root.
- Components use tokens (`bg-background`, `text-foreground`, `bg-primary`, `border-border`,
  `bg-surface`, `bg-surface-2`, `text-muted-foreground`, …) — never hard-coded colors —
  so light/dark switch automatically.

## 7. Data fetching, loading, empty & error states

Every data page follows the same pattern:

```tsx
const q = useQuery({ queryKey: ["documents"], queryFn: api.listDocuments });
// <DataTable rows={q.data} isLoading={q.isLoading} error={q.error} onRetry={q.refetch} .../>
```

`DataTable` (and the `LoadingState` / `EmptyState` / `ErrorState` primitives) render the
right state automatically, so consistency is enforced by shared components rather than
copy-paste. Responsive: tables scroll inside their container; grids reflow 1→2→3 cols;
the sidebar collapses to a drawer on mobile.

## 8. Backend API mapping & known gaps

`lib/api.ts` methods map 1:1 to gateway routes:

| Area | Methods | Endpoint |
|---|---|---|
| Auth | `login`, `getMe` | `/auth/token`, `/api/identity/me` |
| Chat | `chat`, `chatStream` | `/api/orchestrator/chat`, `/chat/stream` |
| Documents | `listDocuments`, `getDocument`, `uploadDocument`, `retrieve` | `/api/knowledge/*` |
| Workflows | `listWorkflows`, `getWorkflow`, `startDocumentReview`, `approveWorkflow`, `rejectWorkflow` | `/api/workflows/*` |
| Connectors | `listConnectors`, `configureConnector` | `/api/connectors/*` |
| Audit | `listAuditEvents` | `/api/audit/events` |
| Admin | `getTenant`, `updateTenantSettings`, `systemHealth`, `listUsers`, `assignRole` | `/api/admin/*`, `/api/identity/*` |

**Gaps (no backend endpoint yet — render honest empty states, do NOT fake data):**
- AI conversation history (list sessions/messages)
- Document preview/download + version history
- A metrics/analytics API (Analytics derives simple counts from existing list endpoints)
- API keys, LLM-provider config (Settings)
- Prompt management (Admin)

These are the endpoints the backend team should add for full feature parity.

## 9. Build status

- ✅ **Built**: foundation (api client, session, theme, shared components), the app
  shell (sidebar + header, responsive, RBAC, theme switch), and the **Dashboard**
  (6 live widgets on real endpoints).
- 🚧 **Stubbed** (navigable, honest empty states, wired next): AI Assistant, Documents,
  Workflows, Approvals, Knowledge, Connectors, Analytics, Settings, Admin.

## 10. Running locally

```bash
cp .env.example .env          # VITE_API_URL=http://localhost:8000  (the gateway)
npm install
npm run dev                   # http://localhost:8080
```
The backend gateway must be running on `VITE_API_URL`. Demo login:
`owner@demo.aios.local` / `Passw0rd!`.

Quality gates: `npx tsc --noEmit` (types) and `npx eslint src` (lint). Both are clean.

## 11. Conventions for contributors

- Never call a backend service directly — add a typed method in `lib/api.ts` and use it.
- Never hard-code colors — use theme tokens so dark mode works.
- Every list/detail view uses `useQuery` + the shared state components.
- Keep everything **industry-neutral**. Industry specifics belong in a future config layer.
- Gate manager-only UI with `useSession().isManager`.
