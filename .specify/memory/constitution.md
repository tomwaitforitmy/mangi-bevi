<!--
Sync Impact Report
- Version change: (none, initial ratification) → 1.0.0
- Modified principles: n/a (first draft)
- Added sections: Core Principles (I–VI), Architecture Constraints,
  Development Workflow, Governance
- Removed sections: none
- Templates requiring updates: none pending — plan/spec/tasks templates
  are generic and read this file at runtime, no direct edits needed.
- Follow-up TODOs: none; all placeholders resolved.
-->

# Mangi Bevi Constitution

## Core Principles

### I. Test-First (NON-NEGOTIABLE)

TDD is mandatory for spec-kit-planned work: a failing test MUST exist before
the implementing code is written, then the implementation makes it pass
(Red-Green-Refactor). `/speckit-tasks` MUST sequence test-authoring tasks
before the implementation tasks they cover. Applies to `tests/unit-tests/`,
`tests/component-tests/`, and `tests/integration/` alike, matched to what's
being changed.

**Rationale**: The project's few serious regressions (lost updates on
concurrent meal edits, links silently reappearing) were caught and fixed by
writing the missing test first, not by ad-hoc manual testing. Codifying that
order for planned work, not just after-the-fact fixes.

### II. Concurrency-Safe Multi-Client Writes (NON-NEGOTIABLE)

Any write path touching a resource multiple clients can edit concurrently
(`meal` today; any future equivalent) MUST go through
`runOptimisticTransaction` (`firebase/optimisticTransaction.js`) with a real
merge function — never a blind full-object PATCH/PUT. Array fields need
three-way merge (see `threeWayMerge` / `buildMealUpdatePayloadThreeWay` in
`store/actions/mealsAction.js`) to distinguish removed vs. edited-in-place vs.
inserted.

**Rationale**: Blind PATCH previously caused silent lost updates (a stale
patch overwriting a more recent `links` change) — a correctness bug users
can't detect themselves. See `docs/optimistic-transaction-design.md`.

### III. Explicit Permission Checks (NON-NEGOTIABLE)

Any "can this user mutate this meal" check MUST go through
`HasEditPermission(user, authorId, authorFriends)`
(`common_functions/HasEditPermission.js`), never a direct `authorId === user.id`
comparison. Friendship is a one-directional grant (adding a friend gives
*them* edit rights on *your* meals), so direct comparisons silently drop the
friend case.

**Rationale**: Centralizes a security-relevant check in one tested function
instead of re-deriving (and risking getting wrong) at each call site.

### IV. JavaScript-Only

The codebase stays 100% `.js`. `tsconfig.json` exists but is not used for
type-checking — it MUST NOT be treated as license to add `.ts`/`.tsx` files
incrementally. Adopting TypeScript is an explicit, whole-codebase decision to
be made separately, not a per-feature/per-file choice (e.g. the expo-router
migration keeps route files as `.js`, not the framework's default `.tsx`).

**Rationale**: A mixed JS/TS codebase with no enforced boundary is worse than
consistently one or the other; avoid drifting into that by accident via
whichever template or example a given dependency ships.

### V. Single-Purpose, Independently Tested Utilities

`common_functions/` holds one pure function per file, each with a matching
test file in `tests/unit-tests/`. `models/` holds plain object constructor
functions, no behavior. New utility logic follows this shape rather than
being inlined into screens/components or grouped into multi-function utility
files.

**Rationale**: Keeps utilities trivially unit-testable and greppable —
the existing one-function/one-file/one-test convention already holds
throughout the repo; deviating fragments it.

### VI. Minimal Footprint

Changes — spec-kit-planned or not — stay scoped to what was asked: no
speculative abstractions, no unrequested refactors riding along, no
half-finished scaffolding. Three similar lines beat a premature shared
helper. Comments explain non-obvious *why*, not *what* (names should already
say what).

**Rationale**: Solo-maintained project; every extra abstraction or
unrequested change is pure future maintenance cost with no reviewer to
share it, and this mirrors the working style already set in `CLAUDE.md`.

## Architecture Constraints

- No server-side/backend code. The client talks directly to **Firebase
  Realtime Database** via its REST API (not SDK realtime listeners) for all
  data (`meals`, `users`, `tags`, `reports`, `mealCookedByUser`, `features`),
  and to **Firebase Auth** for login/signup/user management.
- **Appwrite** is the primary image storage backend. **Supabase** is a
  leftover comparison experiment wired only into `screens/DevScreen.js` —
  not used in production, not to be depended on by real features unless a
  deliberate migration decision is made (see the Appwrite free-tier
  auto-pause issue tracked outside this file for that possible future).
- Directory boundaries are meaningful, not arbitrary: `screens/` (full pages,
  Redux-connected), `components/` (reusable, prop-driven), `common_functions/`
  (pure utilities), `models/` (plain data shapes), `firebase/`/`appwrite/`/
  `supabase/` (backend integrations), `notifications/` (Expo push),
  `data/` (static config/constants). New code respects these, doesn't blur
  them for convenience.

## Development Workflow

- Non-trivial features (new screens, new data flows, migrations like the
  expo-router one) go through spec-kit before implementation:
  `/speckit-specify` → (optionally `/speckit-clarify`) → `/speckit-plan` →
  `/speckit-tasks` → `/speckit-implement`. Trivial bug fixes (the icon-crash
  fixes done this week) don't need the full ceremony.
- `EXPO_PUBLIC_DEV_MODE` should be on when exercising create/edit flows so
  new meals are flagged `isTestMangi: true` and stay identifiable/disposable
  via `firebase/deleteTestMangis.js`, rather than polluting real data.
- Release flow is manual by design: `npm run prerelease` → `git push --tags`
  → EAS workflow build → manual promotion in App Store Connect / Google Play
  Console. No auto-publish to stores.
- `npm test` MUST pass before a commit lands. `npm run lint` is currently
  broken for reasons unrelated to any single change (pre-existing
  `@react-native-community/eslint-config` / ESLint 8 incompatibility) — this
  is a known gap, not a gate, until fixed separately.
- Commit messages and in-repo documentation stay extremely concise, per
  `CLAUDE.md`'s own style rule — this constitution is the one exception
  written in full sentences, because governance text needs to be
  unambiguous, not because the rule doesn't apply elsewhere.

## Governance

This constitution supersedes ad-hoc practice for anything it explicitly
covers; where it's silent, `CLAUDE.md` remains the fast day-to-day
reference. If the two ever conflict, amend `CLAUDE.md` to match this file,
not the other way around — this is the canonical, versioned source.

Tommy (sole maintainer) has final authority and may amend this document
directly; no separate approval step exists for a one-person project.
Amendments MUST update the version per semantic versioning (MAJOR: a
principle removed or redefined incompatibly; MINOR: a principle or section
added; PATCH: clarification/wording) and prepend a Sync Impact Report
documenting the change, as this file's own header does.

`/speckit-plan`, `/speckit-analyze`, and `/speckit-tasks` runs SHOULD check
their output against these principles and flag violations explicitly rather
than silently deviating.

**Version**: 1.0.0 | **Ratified**: 2026-08-29 | **Last Amended**: 2026-08-29
