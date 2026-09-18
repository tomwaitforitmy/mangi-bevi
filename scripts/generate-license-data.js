#!/usr/bin/env node
// Regenerates data/generated/openSourceLicenses.json from the app's actual
// production dependency tree. Run by scripts/prerelease.fish before each
// release — see specs/004-about-page/research.md #1/#4.

const fs = require("fs");
const path = require("path");
const licenseChecker = require("license-checker-rseidelsohn");
const requiresAttribution = require("./lib/requiresAttribution");

const OUTPUT_PATH = path.join(
  __dirname,
  "..",
  "data",
  "generated",
  "openSourceLicenses.json",
);

function parseNameAndVersion(key) {
  const separatorIndex = key.lastIndexOf("@");
  return {
    packageName: key.slice(0, separatorIndex),
    version: key.slice(separatorIndex + 1),
  };
}

function resolveLicenseText(moduleInfo, packageName, license) {
  if (moduleInfo.licenseText) {
    return moduleInfo.licenseText.trim();
  }
  // A handful of packages (monorepo sub-packages sharing a root LICENSE)
  // report no per-package license file — fall back to a short notice
  // instead of omitting the (still attribution-required) entry.
  const repoNote = moduleInfo.repository
    ? ` See ${moduleInfo.repository} for the full license text.`
    : "";
  return `Licensed under ${license}. Full license text was not bundled with ${packageName}.${repoNote}`;
}

licenseChecker.init(
  { start: path.join(__dirname, ".."), production: true, customFormat: { licenseText: "" } },
  (err, packages) => {
    if (err) {
      console.error("✗ license-checker failed:", err.message || err);
      process.exit(1);
    }

    const entries = Object.entries(packages);
    if (entries.length === 0) {
      console.error("✗ license-checker returned zero packages — aborting.");
      process.exit(1);
    }

    const filtered = entries
      .map(([key, moduleInfo]) => {
        const { packageName, version } = parseNameAndVersion(key);
        const license = Array.isArray(moduleInfo.licenses)
          ? moduleInfo.licenses.join(" OR ")
          : moduleInfo.licenses || "UNKNOWN";
        return { packageName, version, license, moduleInfo };
      })
      .filter(({ license }) => requiresAttribution(license))
      .map(({ packageName, version, license, moduleInfo }) => ({
        packageName,
        version,
        license,
        licenseText: resolveLicenseText(moduleInfo, packageName, license),
        repository: moduleInfo.repository || null,
      }))
      .sort((a, b) => a.packageName.localeCompare(b.packageName));

    const output = {
      generatedAt: new Date().toISOString(),
      packages: filtered,
    };

    fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
    console.log(
      `✓ Wrote ${filtered.length} attribution-required package licenses (of ${entries.length} scanned) to ${path.relative(process.cwd(), OUTPUT_PATH)}`,
    );
  },
);
