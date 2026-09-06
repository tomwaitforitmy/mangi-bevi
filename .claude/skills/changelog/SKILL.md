---
name: "changelog"
description: "Write a short, user-facing changelog entry for a mangi-bevi release, in Tommy's established terse style, and update CHANGELOG.md."
argument-hint: "Optional version number or git ref range, e.g. 2.1.0 or v1.81.1..HEAD"
metadata:
  author: "project"
user-invocable: true
disable-model-invocation: false
---

## What this produces

Plain-text release notes, not a markdown document. This is the exact text Tommy pastes into
App Store Connect's "What's New in This Version" and Google Play's "Versionshinweise" fields
during the release flow in `newRelease.md` — no markdown headers, no fluff.

Match this exact shape (this is a real past example, not a template to fill in loosely):

```
Bug fixes version 1.81.1
- fix a bug where broken image-links were saved
- fix a bug where editing was impossible, due to broken links
- fix a bug where new images where not shown immediately
- fix a bug where links could not be removed anymore
- fix a bug where saving tags was impossible
```

A release with genuine new user-facing features gets a second block above the bug fixes,
same style:

```
New in version 2.0.0
- add Light, Dark, and Colorful appearance modes, with an Automatic mode that follows your device's setting
- redesign the bottom tab bar with iOS's native Liquid Glass look
```

Only include a "New in version X" block when there's an actual user-facing feature to report —
most releases are bug-fixes-only, matching the sample above.

## Steps

1. **Find the version range.** The current version lives in `package.json`'s `version` field
   (kept in sync with `app.json` by `scripts/prerelease.fish`). Find the previous release with
   `git tag --list | sort -V | tail -5` — release tags are `vX.Y.Z`. If the current version
   already has a `chore: bump version to X.Y.Z` commit at or near HEAD, diff from the *previous*
   tag up to that commit (or HEAD); otherwise diff from the previous tag to HEAD.

2. **Read the raw commit list**: `git log <prevTag>..<end> --oneline`. Expect this list to be
   long and to include plenty of noise — read every message, don't skim.

3. **Filter out what a user never sees.** Drop:
   - Version bump / chore commits (`chore: bump version to X`).
   - Pure internal refactors, dependency bumps, and doc/process commits (spec-kit
     specify/plan/tasks/constitution churn, CLAUDE.md edits, test-only changes) unless they
     fixed a real user-visible symptom.
   - Anything explicitly scoped to `DEV_MODE` / dev-only tooling (e.g. a crash that only occurs
     in the dev-only "find corrupt data" check) — not something a real user ever hit.
   - Reverted or superseded attempts (e.g. three commits fixing the same bug where only the last
     one actually worked) — report the outcome once, not the debugging journey.

4. **Consolidate ruthlessly.** This project's dark-mode/theming pass alone can produce 20+
   separate "fix black text in dark mode on screen X" commits in one release. That's ONE bullet
   in the changelog ("fix many texts, icons and buttons that were unreadable in dark mode"), not
   twenty. Group by user-visible symptom, not by commit or by file touched. The rule from Tommy's
   own instructions: keep it short, focus only on the major changes. A handful of bullets per
   section is the target, not an exhaustive log.

5. **Write from the user's side of the screen.** Describe what someone using the app
   experienced, not the implementation ("fix a bug where editing a tag silently failed to save",
   not "fix getTagUrl pointing at the wrong Firebase path"). Lowercase, no trailing periods,
   `fix a bug where X` / `add X` / `redesign X` phrasing, one line each.

6. **Update `CHANGELOG.md`** at the repo root (create it if it doesn't exist yet). Prepend the
   new entry above whatever's already there, newest release first, separated by a blank line.

7. **Show the result in the chat too** — Tommy copies it straight into the store release-notes
   fields per `newRelease.md`, so don't bury it only in the file.
