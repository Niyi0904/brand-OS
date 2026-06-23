# MarketingOS

> **The Operating System for AI-Powered Marketing Teams.**

MarketingOS is a production-ready SaaS platform that enables agencies, freelancers, in-house marketing teams, and businesses to manage multiple brands with the power of AI employees. Each brand gets a **Brand Brain** — a centralised knowledge repository that all AI employees automatically reference to produce consistent, on-brand marketing output.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [AI Provider Abstraction](#ai-provider-abstraction)
- [AI Employees System](#ai-employees-system)
- [Brand Brain](#brand-brain)
- [Authentication & Multi-Tenancy](#authentication--multi-tenancy)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Configuration](#configuration)
- [Development Guidelines](#development-guidelines)
- [Milestones](#milestones)
- [License](#license)

---

## Overview

MarketingOS is built on **Next.js 15** (App Router) with **TypeScript** throughout, **PostgreSQL** via **Prisma ORM**, **Auth.js v5** for authentication, and **Tailwind CSS v4** for styling.

The platform is structured around a multi-tenant, multi-brand architecture:

- **Organisations** represent companies or teams (multi-tenant).
- **Brands** live under an organisation and can be managed separately with their own identity, strategy, and content.
- **AI Employees** are configurable AI personas (Marketing Director, Content Director, etc.) that use the brand's **Brand Brain** data as context for every response.

---

## Key Features

### 🔧 AI Employees
Six built-in system AI employees with full prompt engineering:
- **Marketing Director** — strategic marketing leadership, campaign oversight
- **Content Director** — content strategy, editorial planning, SEO optimisation
- **Creative Director** — visual creative direction, brand identity
- **SEO Director** — keyword research, on-page & technical SEO
- **Sales Director** — sales strategy, conversion funnel optimisation
- **Analytics Director** — data analysis, performance measurement, dashboards

Each employee includes a structured prompt with `{{BRAND_BRAIN}}` template variable, thinking framework, decision tree, output format, and quality checklist.

### 🧠 Brand Brain
Centralised brand knowledge with 20+ fields:
- Mission, Vision, Values
- Target Audience, Customer Personas
- Products & Services
- Tone of Voice, Brand Colors, Typography
- Competitors, SEO Keywords
- Goals, Preferred Platforms, Writing Style
- Marketing Strategy, Offers, Business Info
- Locations, FAQs, Brand Rules

All AI employee prompts automatically reference the Brand Brain data to ensure contextually aware, brand-consistent responses.

### 🏢 Multi-Brand & Multi-Tenant
- Organisations with role-based access (OWNER, ADMIN, MEMBER)
- Multiple brands per organisation with isolated brand contexts
- Brand switcher across the dashboard

### 📋 Campaign Management
- Full campaign CRUD with goals, audience targeting, offers
- Status workflow: DRAFT → ACTIVE → PAUSED → COMPLETED → ARCHIVED
- KPI and performance tracking via JSON fields

### 📝 Content Planner
- Content items with type (POST, STORY, REEL, VIDEO, BLOG, EMAIL, AD, OTHER)
- Scheduling and publishing workflow (DRAFT → SCHEDULED → PUBLISHED)
- Platform targeting per content item
- Campaign association

### 🖼️ Media Library
- File storage with type classification (IMAGE, VIDEO, DOCUMENT, AUDIO)
- Folder organisation, tags, alt text
- Per-brand asset management

### 💬 AI Chat Interface
- Conversation history with messages (USER, ASSISTANT, SYSTEM roles)
- Per-brand and per-employee conversation threading
- Streaming support via AI provider abstraction
- Metadata on messages for rich context

### 📚 Knowledge Base
- Rich articles with categories and tags
- Full-text search support

### 📊 Analytics & SEO (Coming in M3+)
- Multi-platform analytics dashboards
- AI-powered SEO audit, keyword research, metadata suggestions

### 💳 Subscriptions & Billing
- FREE, PRO, ENTERPRISE plans
- Stripe integration
- AI credit tracking per organisation
- Usage limits and metering

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS v4 + custom design system (CSS variables) |
| **UI Primitives** | Radix UI (Dialog, DropdownMenu, Label, Select, Tabs, Toast, Tooltip) |
| **Icons** | Lucide React |
| **Database** | PostgreSQL |
| **ORM** | Prisma 5 |
| **Auth** | Auth.js v5 (NextAuth) with Google, GitHub, Credentials providers |
| **State Management** | TanStack Query v5 (server state) + Zustand v5 (client state) |
| **Forms** | React Hook Form + Zod validation |
| **AI SDKs** | Vercel AI SDK, OpenAI, Anthropic SDK, Google Vertex AI |
| **Payments** | Stripe |
| **Email** | Resend |
| **File Upload** | UploadThing |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Markdown** | react-markdown + remark-gfm |
| **Utilities** | clsx, tailwind-merge, class-variance-authority, date-fns |

---

## Database Schema

The **Prisma schema** (`prisma/schema.prisma`) defines 15 models:

### User & Authentication
- **User** — Core user with email/password or OAuth, has brands, conversations, and organisation memberships
- **Account** — OAuth provider accounts (Google, GitHub)
- **Session** — Database sessions (when not using JWT strategy)
- **VerificationToken** — Email verification tokens

### Organisation & Multi-Tenancy
- **Organization** — Top-level tenant with unique slug, owns brands and subscriptions
- **OrganizationMember** — User-Org membership with role (OWNER, ADMIN, MEMBER)

### Brand Management
- **Brand** — Per-brand entity with slug, logo, description, owned by user + organisation
- **BrandBrain** — One-to-one with Brand, holds 20+ fields for brand knowledge serialisation

### AI Employees
- **AIEmployee** — Configurable AI persona with name, title, system prompt, thinking framework, decision tree, output format, examples, quality checklist. Supports system (built-in) and custom variants. Belongs to a user or organisation.

### Conversations & Chat
- **Conversation** — Chat session tied to a brand, user, and optionally an AI employee
- **Message** — Individual message in a conversation with role (USER, ASSISTANT, SYSTEM), content, and JSON metadata

### Campaigns & Content
- **Campaign** — Marketing campaign with name, description, goal, audience, offer, status, KPIs, performance data
- **ContentItem** — Content piece with type, platform, status, scheduling, campaign association

### Media Library
- **MediaAsset** — File with name, URL, type, size, MIME type, folder, tags, alt text

### Knowledge Base
- **KnowledgeArticle** — Rich article with title, content, category, tags

### Subscriptions
- **Subscription** — Organisational subscription with plan (FREE, PRO, ENTERPRISE), Stripe integration, AI credit tracking, billing periods

---

## Architecture

### Folder Structure (Strict)

```
src/
├── app/
│   ├── (auth)/                  # Unauthenticated routes (signin, signup)
│   ├── (dashboard)/             # Protected dashboard routes
│   │   └── layout.tsx           # SERVER component — fetches brands, auth check
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth route handler
│   │   ├── brands/              # Brand API routes (switch, etc.)
│   │   └── ai-employees/        # AI employee API routes
│   ├── globals.css              # Design system CSS variables + component classes
│   └── layout.tsx               # Root layout (Inter font)
│
├── components/
│   ├── layout/                  # Sidebar, BrandSwitcher (props-only, no fetching)
│   └── ui/                      # Reusable primitives (Radix UI wrappers)
│
├── features/
│   ├── ai/                      # AI feature modules
│   ├── auth/                    # Auth feature modules
│   └── brand/                   # Brand feature modules
│
├── lib/
│   ├── auth.ts                  # NextAuth configuration (providers, callbacks, events)
│   ├── auth.config.ts           # NextAuth middleware config
│   ├── db.ts                    # Prisma singleton (global cache for dev)
│   ├── utils.ts                 # cn(), formatDate(), generateSlug(), etc.
│   ├── validations.ts           # Zod schemas for all entities
│   ├── brand-context.tsx        # React Context for active brand ("use client")
│   ├── ai/
│   │   ├── index.ts             # Barrel exports
│   │   ├── provider-factory.ts  # Factory: creates provider instances from env config
│   │   ├── types/index.ts       # AIMessage, AIProviderInterface, AICompletionOptions, etc.
│   │   └── providers/           # OpenAI, Anthropic, Gemini, OpenRouter implementations
│   └── ai-employees/
│       ├── default-employees.ts # 6 built-in system employees (Marketing, Content, Creative, SEO, Sales, Analytics Directors)
│       └── employee-service.ts  # AI employee business logic
│
├── styles/                      # Additional styles
├── types/
│   ├── index.ts                 # BrandWithBrain, BrandBrainData, etc.
│   └── next-auth.d.ts           # NextAuth type augmentation
├── auth.ts                      # Re-exported auth for convenient imports
└── middleware.ts                # Route protection (dashboard → auth check)
```

### Key Architectural Principles

| Principle | Implementation |
|---|---|
| **Data Fetching** | Server Components → direct `db.*` (Prisma) calls. Client Components → TanStack Query. Forms → Server Actions + `useActionState` + Zod. |
| **No `useEffect` fetching** | Server state is never fetched with `useEffect` + `useState`. Use Server Components or TanStack Query exclusively. |
| **Props-only Components** | Components never fetch their own data — they receive it via props from parent Server Components. |
| **AI Provider Abstraction** | All AI SDK imports are isolated to `src/lib/ai/provider-factory.ts`. No direct OpenAI/Anthropic imports anywhere else. |
| **Server Actions Pattern** | Forms use `"use server"` actions with Zod validation, auth check, and redirect. |
| **Strict TypeScript** | No `any`, no `as any`. All params and returns explicitly typed. Prefer `type` over `interface`. |

---

## AI Provider Abstraction

The AI layer supports multiple providers through a clean **Factory Pattern**:

```
AIProviderInterface (interface)
├── OpenAIProvider     → gpt-4o (default)
├── AnthropicProvider  → claude-3-5-sonnet-20241022
├── GeminiProvider     → gemini-1.5-pro
└── OpenRouterProvider → routes to various models via OpenRouter
```

All providers implement the same interface:
- `complete(messages, options?)` → `Promise<AICompletionResponse>` (non-streaming)
- `stream(messages, options?)` → `AsyncGenerator<AIStreamChunk>` (streaming)
- `validateConfig()` → `boolean`

The **AIProviderFactory** singleton:
- Lazily creates and caches provider instances
- Reads API keys and model names from environment variables
- Supports runtime provider switching
- Validates configurations on demand

**Env vars**: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_AI_API_KEY`, `OPENROUTER_API_KEY`, plus individual `*_MODEL` overrides.

---

## AI Employees System

### Built-in Employees

| Employee | Purpose |
|---|---|
| **Marketing Director** | Strategic leadership, campaign oversight, market analysis |
| **Content Director** | Content strategy, editorial planning, SEO copywriting |
| **Creative Director** | Visual direction, brand identity, design concepts |
| **SEO Director** | Keyword research, on-page/technical SEO, link building |
| **Sales Director** | Sales strategy, conversion optimisation, pipeline management |
| **Analytics Director** | Data analysis, campaign measurement, dashboards |

Each employee has a structured prompt template containing:
- Role definition
- Responsibilities list
- Thinking framework (step-by-step logic)
- Decision tree description
- **`{{BRAND_BRAIN}}`** placeholder — replaced at runtime with the brand's serialised Brand Brain data
- Output format specification
- Example deliverables
- Quality checklist

Custom employees can be created per organisation with tailored prompts.

---

## Brand Brain

The Brand Brain is the **central nervous system** of MarketingOS. It is a one-to-one relation with the `Brand` model containing 20+ fields that define everything about a brand.

When a user interacts with any AI employee, the Brand Brain data is serialised into a structured text block and injected into the employee's system prompt via the `{{BRAND_BRAIN}}` template variable. This ensures every AI response is aware of:

- **Who the brand is** (mission, vision, values)
- **Who they talk to** (target audience, personas)
- **What they offer** (products, services, offers)
- **How they speak** (tone of voice, writing style)
- **What they look like** (colors, typography)
- **Who competes with them** (competitors)
- **What they're trying to achieve** (goals, marketing strategy)
- **Where they operate** (locations, platforms)

The Brand Brain form (Milestone 2) is at `src/app/(dashboard)/brands/[slug]/settings/page.tsx` and the serialiser lives in `src/lib/brand-context-serializer.ts`.

---

## Authentication & Multi-Tenancy

### Auth Providers
- **Email/Password** — Credentials provider with bcrypt password hashing
- **Google OAuth** — Google Sign-In
- **GitHub OAuth** — GitHub Sign-In

### Auth Flow
1. User signs up via credentials or OAuth
2. `createUser` event auto-creates a default Organisation with the user as OWNER
3. JWT session strategy (no database sessions)
4. Middleware protects `/dashboard/*` and redirects authenticated users from `/auth/*`
5. Session user object includes `id`, `name`, `email`, `image`

### Multi-Tenancy
- Organisations are the top-level tenant boundary
- Brands belong to organisations (with optional user fallback)
- `OrganizationMember` with roles: OWNER (full access), ADMIN (management), MEMBER (usage)
- Subscriptions are per-organisation

---

## Getting Started

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **PostgreSQL** 14+ (local or cloud)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd marketing-os
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration (see [Configuration](#configuration)).

4. **Push the database schema:**
   ```bash
   npm run db:push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

### Seed Data (Optional)

```bash
npm run db:seed
```

This seeds the database with default AI employees and sample data.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint across the codebase |
| `npm run typecheck` | Run TypeScript compiler check (`tsc --noEmit`) |
| `npm run db:generate` | Generate Prisma client from schema |
| `npm run db:migrate` | Create and apply a new Prisma migration |
| `npm run db:push` | Push schema changes directly to the database |
| `npm run db:studio` | Open Prisma Studio GUI for database browsing |
| `npm run db:seed` | Seed the database with initial data |

---

## Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/marketing-os"

# NextAuth
AUTH_SECRET="your-secret-here"
AUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""

# AI Providers (at least one)
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-4o"

ANTHROPIC_API_KEY=""
ANTHROPIC_MODEL="claude-3-5-sonnet-20241022"

GOOGLE_AI_API_KEY=""
GEMINI_MODEL="gemini-1.5-pro"

OPENROUTER_API_KEY=""
OPENROUTER_MODEL="anthropic/claude-3.5-sonnet"
```

### Optional Environment Variables

```env
# Stripe
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

# Email (Resend)
RESEND_API_KEY=""

# File Upload
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""
```

---

## Development Guidelines

### Code Style

- **Strict TypeScript** — No `any`, no `as any`. All exports are explicitly typed.
- **Named exports only** for components (exception: Next.js requires default exports for `page.tsx` and `layout.tsx`).
- **Path aliases** — Always use `@/` (e.g., `import { db } from "@/lib/db"`). Never use relative paths going up more than one level.
- **Prefer `type` over `interface`** for object shapes (use `interface` only for public API declarations).
- **Discriminated unions** over optional chaining where possible.

### Data Fetching Rules

| Scenario | Method |
|---|---|
| Server Component fetching | Direct `db.*` (Prisma) calls |
| Client Component fetching | TanStack Query (`useQuery`, `useMutation`) |
| Form submissions | Server Actions + `useActionState` + Zod |
| API routes | Only for webhooks and external integrations |

### Component Rules

- `"use client"` must be the literal first line for client components
- Components must be **props-only** — never fetch their own data
- Co-locate Server Actions (`actions.ts`) with the page that uses them
- No `useEffect` + `useState` for server data fetching
- No `localStorage` or `sessionStorage`

### Styling Conventions

The design system uses CSS variables defined in `globals.css`. Never hardcode colours.

| CSS Variable | Default Value | Usage |
|---|---|---|
| `var(--brand-accent)` | `#7c9cff` | Primary actions, active states |
| `var(--color-bg)` | `#08090f` | Page background |
| `var(--color-surface-1)` | `#101119` | Cards, sidebar |
| `var(--color-surface-2)` | `#171924` | Inputs, secondary cards |
| `var(--color-surface-3)` | `#202331` | Hover states, badges |
| `var(--color-border)` | `rgba(255,255,255,0.08)` | All borders |
| `var(--color-text-primary)` | `rgba(255,255,255,0.94)` | Headings, labels |
| `var(--color-text-secondary)` | `rgba(255,255,255,0.62)` | Body, descriptions |
| `var(--color-text-tertiary)` | `rgba(255,255,255,0.38)` | Hints, placeholders |

- Use **Tailwind** for layout and spacing
- Use **inline styles** when referencing CSS variables (Tailwind cannot interpolate them)
- Border radius scale: 6px (small), 8px (default), 10–12px (cards), 16px (large panels)

### Error Handling

- Server Actions return `{ errors }` or `{ message }` — never throw to the client
- API routes return proper HTTP status codes with `{ error: string }` JSON body
- Use `notFound()` from `next/navigation` for 404 cases in Server Components
- Use `redirect()` for auth redirects — never `router.push()` in Server Components
- Use `console.error` for real errors only — never `console.log` in production code

---

## Milestones

| # | Milestone | Status |
|---|---|---|
| 1 | Project Foundation — Next.js, TypeScript, Tailwind, Prisma, PostgreSQL, Auth.js | ✅ Complete |
| 2 | **Brand Brain** — Full form + context serialiser + settings page | 🔄 In Progress |
| 3 | AI Provider Abstraction — Multi-provider SDK factory | ⏳ |
| 4 | AI Employees System — Prompt library, Brand Brain integration | ⏳ |
| 5 | AI Chat Interface — ChatGPT-like UI, streaming, markdown | ⏳ |
| 6 | Dashboard — Overview, analytics, quick actions, brand health score | ⏳ |
| 7 | Content Planner — Calendar view, drag-and-drop, approval workflow | ⏳ |
| 8 | Campaigns — CRUD, goals, KPIs, performance tracking | ⏳ |
| 9 | Media Library — File storage, folders, tags, search | ⏳ |
| 10 | SEO Tools — Website audit, keyword research, metadata | ⏳ |
| 11 | Analytics — Multi-platform dashboards, AI recommendations | ⏳ |
| 12 | Knowledge Base — Rich text, categories, file uploads | ⏳ |
| 13 | Payment Integration — Stripe subscriptions, usage limits, AI credits | ⏳ |
| 14 | Email & WhatsApp Marketing — Campaign management, automation | ⏳ |

---

## Contributing

MarketingOS is a commercial SaaS product. All contributions follow strict code review and architectural guidelines. Feature additions must align with the milestone plan and the existing architecture.

### Quick Reference

| Task | Location |
|---|---|
| Add a sidebar nav item | `src/lib/nav.ts` → `NAV_ITEMS` array |
| Protect/unprotect a route | `src/middleware.ts` → `PUBLIC_ROUTES` |
| Add a new Zod schema | Co-locate `schema` in the feature's `actions.ts` |
| Change brand accent colour | Inline style on dashboard layout root div |
| Add a new AI employee | `src/lib/ai/employees/[employee-name].ts` (M3) |
| Add a new AI provider | `src/lib/ai/providers/[provider].ts` + `provider-factory.ts` |
| Add a Prisma table | Update `prisma/schema.prisma` → `npm run db:migrate` |

---

## License

**Proprietary** — All rights reserved.

---

*Built with Next.js 15, Prisma, PostgreSQL, Auth.js v5, TanStack Query v5, and Tailwind CSS v4.*