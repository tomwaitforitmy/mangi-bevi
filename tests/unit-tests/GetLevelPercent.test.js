import { GetLevelPercent } from "../../common_functions/GetLevelPercent";

describe("GetLevelPercent", () => {
  it("0.5 for the middle", () => {
    const result = GetLevelPercent(16, 18, 17);
    expect(result).toEqual(0.5);
  });
  it("0 for the start", () => {
    const result = GetLevelPercent(16, 18, 16);
    expect(result).toEqual(0);
  });
  it("0.99 for the end", () => {
    const result = GetLevelPercent(50, 150, 149);
    expect(result).toEqual(0.99);
  });
  it("0.33 for a third", () => {
    const result = GetLevelPercent(55, 70, 60);
    expect(result).toBeCloseTo(1 / 3);
  });
  it("0.4", () => {
    const result = GetLevelPercent(0, 10, 4);
    expect(result).toEqual(0.4);
  });
  it("0 for nothing", () => {
    const result = GetLevelPercent(10, 99, 10);
    expect(result).toEqual(0);
  });
});
