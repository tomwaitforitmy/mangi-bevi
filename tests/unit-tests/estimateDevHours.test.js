const estimateDevHours = require("../../scripts/lib/estimateDevHours");

describe("estimateDevHours", () => {
  const options = { sessionGapSeconds: 7200, firstCommitCreditSeconds: 1800 };

  it("sums real elapsed time for a tight cluster of commits", () => {
    // 3 commits, 10 minutes apart each -> 2 gaps of 600s + 1800s first-commit credit
    const base = 1_700_000_000;
    const timestamps = [base, base + 600, base + 1200];

    const result = estimateDevHours(timestamps, options);

    expect(result.sessionCount).toBe(1);
    expect(result.estimatedHours).toBeCloseTo((1800 + 600 + 600) / 3600, 5);
  });

  it("adds only the fixed per-session credit across a gap over the threshold", () => {
    const base = 1_700_000_000;
    const timestamps = [base, base + 7201]; // gap just over sessionGapSeconds

    const result = estimateDevHours(timestamps, options);

    expect(result.sessionCount).toBe(2);
    expect(result.estimatedHours).toBeCloseTo((1800 + 1800) / 3600, 5);
  });

  it("returns just the first-commit credit for a single timestamp", () => {
    const result = estimateDevHours([1_700_000_000], options);

    expect(result.sessionCount).toBe(1);
    expect(result.estimatedHours).toBeCloseTo(1800 / 3600, 5);
  });

  it("returns zero for an empty array", () => {
    const result = estimateDevHours([], options);

    expect(result).toEqual({ estimatedHours: 0, sessionCount: 0 });
  });

  it("is insensitive to input order (sorts timestamps first)", () => {
    const base = 1_700_000_000;
    const sorted = estimateDevHours([base, base + 600, base + 1200], options);
    const shuffled = estimateDevHours(
      [base + 1200, base, base + 600],
      options,
    );

    expect(shuffled).toEqual(sorted);
  });
});
