import { PrepareSelectedLinks } from "../../common_functions/PrepareSelectedLinks.js";
import Meal from "../../models/Meal.js";

describe("PrepareSelectedLinks", () => {
  it("marks m2 as selected", () => {
    const m1 = Meal("Tomato Sauce", "m1");
    m1.links = ["m2"];
    const m2 = Meal("Another Sauce", "m2");
    m2.links = ["m1"];
    const candidates = [m2];

    const result = PrepareSelectedLinks(candidates, m1.links);

    expect(result[0].isSelected).toBe(true);
  });

  it("marks nothing with empty links", () => {
    const m1 = Meal("Tomato Sauce", "m1");
    m1.links = [];
    const m2 = Meal("Another Sauce", "m2");
    m2.links = [];
    const candidates = [m2];

    const result = PrepareSelectedLinks(candidates, m1.links);

    expect(result[0].isSelected).toBe(false);
  });

  it("marks two meals", () => {
    const m1 = Meal("Tomato Sauce", "m1");
    m1.links = ["m2", "m3"];
    const m2 = Meal("Another Sauce", "m2");
    m2.links = ["m1"];
    const m3 = Meal("Another Sauce", "m3");
    m3.links = ["m1"];
    const candidates = [m2, m3];
    const result = PrepareSelectedLinks(candidates, m1.links);

    expect(m1.isSelected).toBe(false);
    expect(result[0].isSelected).toBe(true);
    expect(result[1].isSelected).toBe(true);
  });

  it("does nothing if links is null", () => {
    const m1 = Meal("Tomato Sauce", "m1");
    m1.links = null;
    const m2 = Meal("Another Sauce", "m2");
    m2.links = ["m1"];
    const m3 = Meal("Another Sauce", "m3");
    m3.links = ["m1"];
    const candidates = [m2, m3];
    const result = PrepareSelectedLinks(candidates, m1.links);

    expect(m1.isSelected).toBe(false);
    expect(result[0].isSelected).toBe(false);
    expect(result[1].isSelected).toBe(false);
  });

  it("does nothing if links is undefined", () => {
    const m1 = Meal("Tomato Sauce", "m1");
    m1.links = undefined;
    const m2 = Meal("Another Sauce", "m2");
    m2.links = ["m1"];
    const m3 = Meal("Another Sauce", "m3");
    m3.links = ["m1"];
    const candidates = [m2, m3];
    const result = PrepareSelectedLinks(candidates, m1.links);

    expect(m1.isSelected).toBe(false);
    expect(result[0].isSelected).toBe(false);
    expect(result[1].isSelected).toBe(false);
  });
});
