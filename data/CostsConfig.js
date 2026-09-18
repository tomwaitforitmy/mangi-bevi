// Real, hand-maintained cost figures for the Costs & Transparency page.
// Edit directly when a real cost changes — never touched by any generation
// script (unlike data/generated/*.json). See specs/004-about-page/data-model.md.
module.exports = {
  hourlyRateEur: 25,
  asOf: "2026-09-18",
  monetaryCosts: [
    { label: "Apple Developer Program (4 years)", amountEur: 396 },
    { label: "Google Play Console (one-time)", amountEur: 25 },
    { label: "Claude Code (2 months)", amountEur: 44 },
  ],
};
