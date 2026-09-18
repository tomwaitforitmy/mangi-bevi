const NO_ATTRIBUTION_LICENSES = new Set([
  "unlicense",
  "cc0-1.0",
  "wtfpl",
  "0bsd",
]);

// Splits a simple SPDX expression ("MIT OR Apache-2.0") into its component
// identifiers; a plain identifier with no operator returns a single-item
// array.
function splitSpdxExpression(license) {
  return license
    .split(/\s+(?:OR|AND)\s+/i)
    .map((part) => part.trim().replace(/^\(|\)$/g, ""))
    .filter(Boolean);
}

// Conservative by design: any component that requires attribution makes the
// whole expression require attribution, and an unrecognized identifier
// defaults to true (show it) rather than false (hide it) — see
// specs/004-about-page/research.md #2.
function requiresAttribution(license) {
  if (!license) {
    return true;
  }
  const components = splitSpdxExpression(license);
  return components.some(
    (component) => !NO_ATTRIBUTION_LICENSES.has(component.toLowerCase()),
  );
}

module.exports = requiresAttribution;
