import { GetContrastRatio } from "../../common_functions/GetContrastRatio";

describe("GetContrastRatio", () => {
  it("returns ~21:1 for black on white (max contrast)", () => {
    expect(GetContrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
  });

  it("returns 1:1 for identical colors", () => {
    expect(GetContrastRatio("#0571ff", "#0571ff")).toBeCloseTo(1, 5);
  });

  it("is symmetric regardless of argument order", () => {
    const a = GetContrastRatio("#0571ff", "#ffffff");
    const b = GetContrastRatio("#ffffff", "#0571ff");
    expect(a).toBeCloseTo(b, 5);
  });

  it("returns a known mid-range ratio for white text on the app's primary blue", () => {
    // #0571ff vs white — used elsewhere in the app as a header/background color
    const ratio = GetContrastRatio("#0571ff", "#ffffff");
    expect(ratio).toBeGreaterThan(3);
    expect(ratio).toBeLessThan(5);
  });

  it("handles short 3-digit hex codes", () => {
    expect(GetContrastRatio("#000", "#fff")).toBeCloseTo(21, 0);
  });
});
