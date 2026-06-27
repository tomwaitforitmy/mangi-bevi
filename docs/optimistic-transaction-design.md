# Optimistic Transaction Design (Firebase Realtime DB REST)

Goal: Prevent lost updates when multiple clients edit the same `meal` concurrently. The current bug is a stale full-meal `PATCH` overwriting a prior `links` update, so the fix must preserve independent array mutations and avoid blind whole-object writes.

Summary

- Use the Realtime Database REST API (existing code uses `firebase/urls.js`).
- Implement `firebase/optimisticTransaction.js` exposing `runTransaction(resourceUrl, mergeFn, options)`.
- `mergeFn(current, intended)` returns the new payload to write.
- On write conflict, helper refetches and retries up to N times with jittered backoff.
- The current repro is in `tests/concurrent-edit-repro.js`, which signs in with email/password and simulates:
  1. create fresh test meal
  2. apply a `links` patch
  3. apply a stale full-meal patch using the old `links` array
  4. verify the lost `links` update

API

- `async runTransaction(resourceUrl, mergeFn, {maxRetries=5, timeoutMs=10000, backoffBase=50})`
  - `resourceUrl` full `.json` URL (including auth query if needed).
  - `mergeFn(current)` -> new JSON blob for the resource.
  - Returns the final saved data or throws on fatal error.

Implementation notes

- Prefer conditional writes using `ETag` and `If-Match`:
  1. GET resource with `fetch(resourceUrl)` and read `ETag` header.
  2. Call `mergeFn(currentJson)` to compute `newPayload`.
  3. Attempt `PUT resourceUrl` with header `If-Match: <etag>` and body `JSON.stringify(newPayload)`.
  4. If 200 -> success. If 412 Precondition Failed -> refetch and retry.
- If `ETag` is unavailable or unsupported, fall back to read-merge-retry:
  - GET current state, compute `newPayload`, then `PATCH` or `PUT`.
  - Retry if a concurrent conflict is detected by re-reading and comparing.
- Use exponential backoff with jitter to reduce retry collisions.

Merge strategies for meals

- `editMeal`: should not send full meal objects blindly. Only changed fields should be written, or the helper should preserve unaffected fields by merging with the current state.
- `editLinks`: must merge incoming link changes with the current `links` array rather than replacing it, so separate edits do not clobber one another.
- `editReactions`: already reads current reactions, but it should use the helper to make the read-modify-write cycle safe and detectable if a concurrent update occurs.
- `deleteMeal`: should remove linked references transactionally before deleting the meal, and ideally use conditional delete semantics if supported.

Migration plan (practical steps)

1. Add `firebase/optimisticTransaction.js` with unit tests for the helper.
2. Update `store/actions/mealsAction.js`:
   - `editLinks`: use `runTransaction` and merge the current `links` array with the caller's link changes.
   - `editMeal`: avoid blind whole-object `PATCH`. Either patch only changed fields or compute the final payload from a merge function that preserves fresh current state.
   - `editReactions`: use `runTransaction(getMealUrl(meal.id, token), mergeReactions)` so the helper detects concurrent writes and retries.
   - `deleteMeal`: update linked meals using the transaction helper before deleting the meal itself.
3. Add regression coverage around the repro path:
   - `tests/concurrent-edit-repro.js` is already in place.
   - Add focused unit tests that stub `fetch` and simulate stale writes / ETag conflicts.
4. Run `node tests/concurrent-edit-repro.js` locally with `.env` credentials to confirm the real symptom before and after the fix.

Testing & verification

- Local repro: `node tests/concurrent-edit-repro.js` (uses `.env` credentials for Firebase Auth; no `FIREBASE_TOKEN` is required).
- Unit tests: mock fetch and simulate conflicts; verify retries and preserved array merges.
- Integration: the repro script should fail before the fix and pass after.

Fallback / Long-term

- If REST helper semantics are brittle, migrate critical meal edits to a backend transaction layer (Firebase Admin SDK or Cloud Functions) for true atomic updates.
- The immediate priority is to stop blind whole-object patches on `meal` resources.

Notes

- The current bug is not a generic patch race; it is a stale full-meal patch that nukes a recent `links` update.
- The fix is best implemented at the write helper layer, so all meal-update actions can benefit consistently.
