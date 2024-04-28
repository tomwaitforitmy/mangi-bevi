import { MealEquals } from "../../common_functions/MealEquals";
import Meal from "../../models/Meal";

describe("Given two Meals", () => {
  it("returns true", () => {
    const m1 = Meal();
    const m2 = Meal();
    const result = MealEquals(m1, m2);
    expect(result).toBe(true);
  });
});

describe("Given two Meals with same title", () => {
  it("returns true", () => {
    const m1 = Meal("test");
    const m2 = Meal("test");
    const result = MealEquals(m1, m2);
    expect(result).toBe(true);
  });
});

describe("Given two Meals with same mandatory fields", () => {
  it("returns true", () => {
    const m1 = Meal(
      "test",
      "id",
      "primUrl",
      ["1 item", "another item"],
      ["1 step"],
      ["image url"],
    );
    const m2 = Meal(
      "test",
      "id",
      "primUrl",
      ["1 item", "another item"],
      ["1 step"],
      ["image url"],
    );
    const result = MealEquals(m1, m2);
    expect(result).toBe(true);
  });
});

describe("Given two Meals with different mandatory fields", () => {
  it("returns false", () => {
    const m1 = Meal(
      "test",
      "id",
      "primUrl",
      ["1 item", "another item"],
      ["1 step"],
      ["image url"],
    );
    const m2 = Meal(
      "test",
      "id",
      "primUrl",
      ["1 item", "not equal item"],
      ["1 step"],
      ["image url"],
    );
    const result = MealEquals(m1, m2);
    expect(result).toBe(false);
  });
});

describe("Given two Meals with ingredients in different order", () => {
  it("returns false", () => {
    const m1 = Meal(
      "test",
      "id",
      "primUrl",
      ["wrong", "order"],
      ["1 step"],
      ["image url"],
    );
    const m2 = Meal(
      "test",
      "id",
      "primUrl",
      ["order", "wrong"],
      ["1 step"],
      ["image url"],
    );
    const result = MealEquals(m1, m2);
    expect(result).toBe(false);
  });
});
