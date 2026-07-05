# Landing Page Implementation Plan

## Context

AgentStudio needs a public landing page at the root `/` route. Currently, `/` redirects to `/generate` (which requires auth). The landing page should be standalone — no sidebar, no app chrome — and link to `/login` as the primary CTA.

Two source documents are ready:
- Feature overview: `gg/agent-outputs/codebase-researcher/feature-overview.md`
- Landing page copy: `gg/agent-outputs/codebase-researcher/landing-page-copy.md`

## Architecture: Conditional Sidebar Rendering

The root layout (`app/layout.tsx`) wraps all pages in `SidebarProvider` + `AppSidebar`. To make the landing page standalone without moving any existing files, I'll create a client component that conditionally renders the sidebar based on pathname.

### Files to modify

| File | Change |
|------|--------|
| `app/layout.tsx` | Replace sidebar wrapping with `<ConditionalSidebar>` |
| `app/page.tsx` | Replace redirect with landing page component |
| `middleware.ts` | Add `/` to public (unauthenticated) routes |

### Files to create

| File | Purpose |
|------|---------|
| `components/conditional-sidebar.tsx` | Client component — renders sidebar on app pages, bare children on `/` |
| `components/landing-page.tsx` | Main landing page component with all sections |

### Changes in detail

**1. `middleware.ts`** — Make `/` accessible to unauthenticated users:
```ts
// Change line 29 from:
if (["/login", "/register"].includes(pathname))
// To:
if (["/", "/login", "/register"].includes(pathname))
```

**2. `components/conditional-sidebar.tsx`** — New client component:
- Uses `usePathname()` to detect landing page (`/`)
- On `/`: renders `{children}` directly (no sidebar)
- On all other paths: renders `SidebarProvider` > `AppSidebar` > `SidebarInset` > `LayoutWrapper` > `{children}`

**3. `app/layout.tsx`** — Swap sidebar wrapping for `ConditionalSidebar`:
- Import `ConditionalSidebar` instead of sidebar components
- Pass `user` and `isCollapsed` as props
- Keep everything else (ThemeProvider, Toaster, SessionProvider, etc.) unchanged

**4. `app/page.tsx`** — Replace redirect with landing page:
- Import and render `<LandingPage />`
- Server component that passes session status (to show "Sign In" vs "Go to App" CTA)

**5. `components/landing-page.tsx`** — The landing page itself:

### Landing Page Design

**Display font:** Add `Space_Grotesk` from `next/font/google` for headlines (geometric, modern — pairs well with Geist for body).

**Sections (in order):**

1. **Sticky Nav** — AgentStudioLogo (left), "Sign In" button (right). Transparent background, adds backdrop-blur on scroll. Dark/light mode aware.

2. **Hero** — Large headline ("Turn words into professional images."), subheadline, "Sign In" CTA button. Subtle gradient background.

3. **Problem** — "Creating visual content should not require a design degree." — Two-column text with the pain points.

4. **How It Works** — 4 steps with numbered cards. Fade-in on scroll with framer-motion.

5. **Key Benefits** — 4 benefit cards in a 2x2 grid (mobile: stacked). Icons from lucide-react.

6. **AI Image Models** — Section header, then a responsive grid of 14 model cards showing model name, provider, and 1-2 line description. Grouped visually by provider logo/color.

7. **Chat AI Models** — Simpler list of 6 models with provider labels.

8. **Beyond Single Images** — 4 artifact type cards (Images, Slides, Text, Sheets).

9. **Built for Your Workflow** — Feature grid (aspect ratios, prompt enhancement, version history, gallery, collections, saved prompts, dark mode, responsive).

10. **Final CTA** — "Your next image is a conversation away." + Sign In button.

**Animation:** framer-motion `motion.div` with `whileInView` for scroll-triggered fade-up animations. Staggered children in card grids.

**Color scheme:** Uses existing CSS variables (`--background`, `--foreground`, `--primary`, `--muted`, `--border`). Accent color for CTA buttons. Full dark mode support via existing theme system.

**Responsive:** Mobile-first. Single column on mobile, expanding to multi-column grids on md/lg breakpoints.

## Verification

1. Visit `/` while logged out → landing page renders (no redirect to login)
2. Visit `/` while logged in → landing page renders with "Go to App" CTA instead of "Sign In"
3. Visit `/generate` while logged out → redirects to `/login` (unchanged)
4. Visit `/generate` while logged in → app with sidebar (unchanged)
5. Toggle dark/light mode on landing page → colors switch correctly
6. Resize browser → responsive layout adapts
7. Scroll → animations trigger on viewport entry
8. Click "Sign In" → navigates to `/login`
9. Run `bun run build` → no TypeScript errors
