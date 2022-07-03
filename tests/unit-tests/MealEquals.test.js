import { MealEquals } from "../../common_functions/MealEquals";
import Meal from "../../models/Meal";

describe("Given two new meals", () => {
  it("returns true", () => {
    const m1 = new Meal();
    const m2 = new Meal();
    const result = MealEquals(m1, m2);
    expect(result).toBe(true);
  });
});

describe("Given two new meals with same title", () => {
  it("returns true", () => {
    const m1 = new Meal("test");
    const m2 = new Meal("test");
    const result = MealEquals(m1, m2);
    expect(result).toBe(true);
  });
});

describe("Given two new meals with same mandatory fields", () => {
  it("returns true", () => {
    const m1 = new Meal(
      "test",
      "id",
      "primUrl",
      ["1 item", "another item"],
      ["1 step"],
      ["image url"]
    );
    const m2 = new Meal(
      "test",
      "id",
      "primUrl",
      ["1 item", "another item"],
      ["1 step"],
      ["image url"]
    );
    const result = MealEquals(m1, m2);
    expect(result).toBe(true);
  });
});

describe("Given two new meals with different mandatory fields", () => {
  it("returns false", () => {
    const m1 = new Meal(
      "test",
      "id",
      "primUrl",
      ["1 item", "another item"],
      ["1 step"],
      ["image url"]
    );
    const m2 = new Meal(
      "test",
      "id",
      "primUrl",
      ["1 item", "not equal item"],
      ["1 step"],
      ["image url"]
    );
    const result = MealEquals(m1, m2);
    expect(result).toBe(false);
  });
});

describe("Given two new meals with ingredients in different order", () => {
  it("returns false", () => {
    const m1 = new Meal(
      "test",
      "id",
      "primUrl",
      ["wrong", "order"],
      ["1 step"],
      ["image url"]
    );
    const m2 = new Meal(
      "test",
      "id",
      "primUrl",
      ["order", "wrong"],
      ["1 step"],
      ["image url"]
    );
    const result = MealEquals(m1, m2);
    expect(result).toBe(false);
  });
});
