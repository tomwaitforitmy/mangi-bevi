const DEFAULT_SESSION_GAP_SECONDS = 2 * 60 * 60; // 2h
const DEFAULT_FIRST_COMMIT_CREDIT_SECONDS = 30 * 60; // 30min

// Standard "git-hours" style heuristic: sort commit timestamps, then either
// add the real gap to the previous commit (same work session) or a fixed
// credit for starting a new session — see specs/004-about-page/research.md #3.
function estimateDevHours(
  commitTimestamps,
  {
    sessionGapSeconds = DEFAULT_SESSION_GAP_SECONDS,
    firstCommitCreditSeconds = DEFAULT_FIRST_COMMIT_CREDIT_SECONDS,
  } = {},
) {
  const sorted = [...commitTimestamps].sort((a, b) => a - b);

  if (sorted.length === 0) {
    return { estimatedHours: 0, sessionCount: 0 };
  }

  let totalSeconds = 0;
  let sessionCount = 0;

  sorted.forEach((timestamp, index) => {
    if (index === 0) {
      totalSeconds += firstCommitCreditSeconds;
      sessionCount += 1;
      return;
    }
    const gap = timestamp - sorted[index - 1];
    if (gap < sessionGapSeconds) {
      totalSeconds += gap;
    } else {
      totalSeconds += firstCommitCreditSeconds;
      sessionCount += 1;
    }
  });

  return {
    estimatedHours: totalSeconds / 3600,
    sessionCount,
  };
}

module.exports = estimateDevHours;
