import fs from "fs";
import path from "path";

const ROOT = path.join(__dirname, "..", "..");
const SCAN_DIRS = ["screens", "components", "app"];
const COLOR_LITERAL_PATTERN = /#[0-9a-fA-F]{3,6}\b|rgba?\(/;

// Files where a literal color is an intentional, documented one-off, not a
// call site that should read from the central theme. Keep this list short —
// any addition needs the same justification as these:
// - shadowColor: "black" is a conventional, theme-independent shadow color
//   used throughout the app (matches native platform shadow conventions).
const ALLOWED_LITERAL_LINE = /shadowColor:\s*["']black["']/;

const listJsFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listJsFiles(fullPath);
    }
    return entry.name.endsWith(".js") ? [fullPath] : [];
  });
};

describe("NoHardcodedColorLiterals", () => {
  it("has zero color literals in screens/components/app outside the theme/ modules", () => {
    const offenders = [];

    for (const dir of SCAN_DIRS) {
      const absoluteDir = path.join(ROOT, dir);
      if (!fs.existsSync(absoluteDir)) continue;

      for (const filePath of listJsFiles(absoluteDir)) {
        const lines = fs.readFileSync(filePath, "utf8").split("\n");
        lines.forEach((line, index) => {
          if (COLOR_LITERAL_PATTERN.test(line) && !ALLOWED_LITERAL_LINE.test(line)) {
            offenders.push(
              `${path.relative(ROOT, filePath)}:${index + 1}: ${line.trim()}`,
            );
          }
        });
      }
    }

    expect(offenders).toEqual([]);
  });
});
