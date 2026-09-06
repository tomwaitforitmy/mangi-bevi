import { ContainsArray } from "../../common_functions/ContainsArray";

describe("ContainsArray", () => {
  it("returns true when an item is itself an array", () => {
    expect(ContainsArray(["a", ["b"], "c"])).toBe(true);
  });

  it("returns false for a flat array", () => {
    expect(ContainsArray(["a", "b", "c"])).toBe(false);
  });

  it("returns false instead of throwing for undefined", () => {
    expect(ContainsArray(undefined)).toBe(false);
  });

  it("returns false instead of throwing for null", () => {
    expect(ContainsArray(null)).toBe(false);
  });
});
