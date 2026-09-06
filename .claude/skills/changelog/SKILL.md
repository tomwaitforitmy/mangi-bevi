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

This is the real, final text shipped for 2.0.0 — not a draft, the actual approved version after
trimming. Treat it as the canonical example, both for style and for length:

```
New in version 2.0.0
- add Light, Dark, and Colorful appearance modes, with an Automatic mode that follows your device's setting
- redesign the bottom tab bar with iOS's native Liquid Glass look

Bug fixes version 2.0.0
- fix a bug where deleting a tag failed to save
- fix a bug where new or deleted tags didn't show up in Filters until restarting the app
- fix a bug where swiping triggered the back gesture instead
- fix a bug where opening linked Mangis endlessly grew the back button history
```

That's 496 characters. **Never exceed ~500 characters total, across both sections** — this is
Google Play Console's hard per-locale limit on release notes, not a stylistic preference. Count
the actual draft before presenting it; if it's over, cut bullets (lowest-priority first) rather
than shortening wording until it's unreadable.

A bug-fixes-only release (no genuine new feature) drops the "New in version X" block entirely —
that was the norm before 2.0.0:

```
Bug fixes version 1.81.1
- fix a bug where broken image-links were saved
- fix a bug where editing was impossible, due to broken links
- fix a bug where new images where not shown immediately
- fix a bug where links could not be removed anymore
- fix a bug where saving tags was impossible
```

## Steps

1. **Find the version range.** The current version lives in `package.json`'s `version` field
   (kept in sync with `app.json` by `scripts/prerelease.fish`). Find the previous release with
   `git tag --list | sort -V | tail -5` — release tags are `vX.Y.Z`. If the current version
   already has a `chore: bump version to X.Y.Z` commit at or near HEAD, diff from the *previous*
   tag up to that commit (or HEAD); otherwise diff from the previous tag to HEAD.

2. **Read the raw commit list**: `git log <prevTag>..<end> --oneline`. Expect this list to be
   long and to include plenty of noise — read every message, don't skim.

3. **Drop bugs introduced by a feature shipping in this same release.** If a feature is new in
   this version, fixes for bugs *in that feature* made during the same development cycle are not
   changelog-worthy — no user ever experienced the broken version, since it was never released.
   Concrete case that was gotten wrong once: 2.0.0 introduced dark mode, and a long tail of
   commits fixed dark-mode-specific bugs (unreadable text, wrong contrast, etc.) discovered while
   building it. None of those belong in the changelog — they're not a "fix", they're dark mode
   simply working correctly, which the "add Light, Dark, and Colorful appearance modes" bullet
   already covers. Only list a bug fix if the broken behavior was live in a *previously shipped*
   version.

4. **Filter out what a user never sees.** Drop:
   - Version bump / chore commits (`chore: bump version to X`).
   - Pure internal refactors, dependency bumps, and doc/process commits (spec-kit
     specify/plan/tasks/constitution churn, CLAUDE.md edits, test-only changes) unless they
     fixed a real user-visible symptom in a previously shipped version.
   - Anything explicitly scoped to `DEV_MODE` / dev-only tooling — not something a real user ever
     hit.
   - Reverted or superseded attempts (e.g. three commits fixing the same bug where only the last
     one actually worked) — report the outcome once, not the debugging journey.

5. **Consolidate ruthlessly.** Group by user-visible symptom, not by commit or by file touched —
   e.g. several small wording/contrast tweaks to the same feature are one bullet, not several.
   Combined with rule 3 above, most of a commit list this size collapses to a handful of bullets.
   Keep it short, focus only on the major changes; the ~500-character ceiling enforces this
   either way.

6. **Write from the user's side of the screen.** Describe what someone using the app
   experienced, not the implementation ("fix a bug where editing a tag silently failed to save",
   not "fix getTagUrl pointing at the wrong Firebase path"). Lowercase, no trailing periods,
   `fix a bug where X` / `add X` / `redesign X` phrasing, one line each, terse enough to survive
   the length cap.

7. **Update `CHANGELOG.md`** at the repo root (create it if it doesn't exist yet). Prepend the
   new entry above whatever's already there, newest release first, separated by a blank line.

8. **Show the result in the chat too** — Tommy copies it straight into the store release-notes
   fields per `newRelease.md`, so don't bury it only in the file.
