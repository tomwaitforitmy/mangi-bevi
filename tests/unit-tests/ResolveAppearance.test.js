import { ResolveAppearance } from "../../common_functions/ResolveAppearance";
import { LIGHT, DARK, COLORFUL, AUTOMATIC } from "../../theme/AppearanceOptions";

describe("ResolveAppearance", () => {
  it("returns light unchanged when explicitly selected", () => {
    expect(ResolveAppearance(LIGHT, "dark")).toBe(LIGHT);
  });

  it("returns dark unchanged when explicitly selected", () => {
    expect(ResolveAppearance(DARK, "light")).toBe(DARK);
  });

  it("returns colorful unchanged when explicitly selected", () => {
    expect(ResolveAppearance(COLORFUL, "dark")).toBe(COLORFUL);
  });

  it("resolves automatic + device dark to dark", () => {
    expect(ResolveAppearance(AUTOMATIC, "dark")).toBe(DARK);
  });

  it("resolves automatic + device light to light", () => {
    expect(ResolveAppearance(AUTOMATIC, "light")).toBe(LIGHT);
  });

  it("resolves automatic + unknown/null device scheme to light", () => {
    expect(ResolveAppearance(AUTOMATIC, null)).toBe(LIGHT);
    expect(ResolveAppearance(AUTOMATIC, undefined)).toBe(LIGHT);
  });

  it("treats an unrecognized selection as automatic", () => {
    expect(ResolveAppearance("not-a-real-option", "dark")).toBe(DARK);
    expect(ResolveAppearance("not-a-real-option", "light")).toBe(LIGHT);
  });

  it("treats an undefined selection as automatic", () => {
    expect(ResolveAppearance(undefined, "dark")).toBe(DARK);
  });
});
