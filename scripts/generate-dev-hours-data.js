#!/usr/bin/env node
// Regenerates data/generated/devHoursEstimate.json from the repo's commit
// history. Run by scripts/prerelease.fish before each release — see
// specs/004-about-page/research.md #3/#4. Requires full (non-shallow) git
// history: a shallow clone has too few commits and must fail loudly rather
// than publish a wrong/near-zero estimate.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const estimateDevHours = require("./lib/estimateDevHours");

const OUTPUT_PATH = path.join(
  __dirname,
  "..",
  "data",
  "generated",
  "devHoursEstimate.json",
);

const METHODOLOGY =
  "Estimated from this project's git commit history: consecutive commits " +
  "less than 2 hours apart are treated as the same work session (their " +
  "real time gap is counted); each new session adds a fixed 30-minute " +
  "credit for its first commit. This is a standard, deliberately " +
  "conservative approximation, not a precise time tracker.";

let rawLog;
try {
  rawLog = execFileSync("git", ["log", "--pretty=format:%at"], {
    cwd: path.join(__dirname, ".."),
    encoding: "utf8",
  });
} catch (err) {
  console.error("✗ `git log` failed:", err.message || err);
  process.exit(1);
}

const timestamps = rawLog
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .map(Number);

if (timestamps.length === 0) {
  console.error(
    "✗ `git log` returned zero commits (shallow clone?) — aborting.",
  );
  process.exit(1);
}

const { estimatedHours, sessionCount } = estimateDevHours(timestamps);

const output = {
  estimatedHours: Math.round(estimatedHours * 10) / 10,
  sessionCount,
  commitCount: timestamps.length,
  generatedAt: new Date().toISOString(),
  methodology: METHODOLOGY,
};

fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
console.log(
  `✓ Wrote dev-hours estimate (${output.estimatedHours}h, ${sessionCount} sessions, ${timestamps.length} commits) to ${path.relative(process.cwd(), OUTPUT_PATH)}`,
);
