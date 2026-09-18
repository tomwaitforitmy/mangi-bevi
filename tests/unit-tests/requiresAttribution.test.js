const requiresAttribution = require("../../scripts/lib/requiresAttribution");

describe("requiresAttribution", () => {
  it.each([
    ["MIT", true],
    ["Apache-2.0", true],
    ["BSD-3-Clause", true],
    ["ISC", true],
    ["Unlicense", false],
    ["CC0-1.0", false],
    ["WTFPL", false],
    ["0BSD", false],
    ["unlicense", false],
    ["Some-Custom-License-1.0", true],
    ["MIT OR Apache-2.0", true],
    ["Unlicense OR CC0-1.0", false],
    ["Unlicense OR MIT", true],
  ])("requiresAttribution(%s) === %s", (license, expected) => {
    expect(requiresAttribution(license)).toBe(expected);
  });
});
