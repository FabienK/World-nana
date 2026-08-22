# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

World's Nana — a PWA for iPad, built for a 12-year-old girl. There is no build system, no package manager, and no test suite: each screen/prototype is a single self-contained `.html` file (inline `<style>` and vanilla JS `<script>`, no external JS dependencies except optionally Google Fonts). Open a file directly in a browser (or on an iPad via "Add to Home Screen") to run it — there is nothing to install or compile.

- `brique.html` — the "Brain" (V2) prototype: a self-contained vanilla-JS app (home "planet" screen + card-by-card learning session flow). Marked in its own header comment as "app autonome, sans dépendance réseau après ouverture" (no network dependency after first load) — keep it that way when editing.
- `07-orbital-eclipse.html` — a visual/interaction prototype (canvas-based).
- `frontend.md` / `backend.md` — the product/architecture spec driving current and future work (see below). Read these before implementing new screens or features; they define what's in scope per version.

## Architecture, read from the specs

The specs (`frontend.md`, `backend.md`) define a versioned scope. Treat these as binding constraints, not just background:

**V1 (current priority)**: a Home/selector screen with static, non-tracked shortcuts to external apps (Music, drawing, educational apps) via iOS URL schemes or App Store links. No backend, no server-side storage — only local preferences (chosen font, theme) in `localStorage`/IndexedDB. Must work offline (service worker, cached static assets) and degrade gracefully on weak connections. Roblox access is gated entirely outside the app via native iOS Screen Time — the app never displays or manages that gating.

**V2 (not yet prioritized)**: the "Brain" feature, built by porting `brique.html` into the app rather than rewriting it. Adds session history (theme/word, date, result) and an internal-only dashboard (no data from external apps, ever — this is an explicit, actively-enforced decision, not a placeholder). Persist history in IndexedDB, or Supabase (a single `sessions` table: id, date, thème, durée, résultat) if cross-device history is wanted.

**V3**: light integration between Home and Brain (e.g. surfacing today's Brain session status from Home). Not yet designed.

**Permanently out of scope, all versions**: any Screen Time / DeviceActivity / Family Controls API usage, any usage tracking of third-party apps (Music, drawing, games, Roblox), any app-blocking logic implemented in code. All gating is done manually via iOS Settings, outside this app.

**Accessibility constraints that apply to any UI work**: a dyslexia-friendly font toggle (candidates: Lexend, OpenDyslexic, Atkinson Hyperlegible — not finalized), AA-minimum contrast, large touch targets, low text density.

`brique.html`'s existing visual identity (dark navy `#1B2333`, beige `#F5F1E8`, green accent `#8FB89D`, `ui-rounded`/SF Pro Rounded font) is a reference pattern, not a locked design system for new screens — `frontend.md` explicitly says visual style beyond font-accessibility and PWA-minimalism is still open.
