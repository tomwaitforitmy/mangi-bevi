import { LinkMeals } from "../../common_functions/LinkMeals.js";
import Meal from "../../models/Meal";

describe("LinkMeals", () => {
  it("adds id of another meal", () => {
    const m1 = Meal("Tomato Sauce", "m1");
    m1.links = [];
    const m2 = Meal("Another Sauce", "m2");
    m2.links = [];
    const newLinks = [m2];

    LinkMeals(m1, newLinks);

    expect(m1.links).toStrictEqual(["m2"]);
    expect(m2.links).toStrictEqual(["m1"]);
  });

  it("adds 2 ids", () => {
    const m1 = Meal("Tomato Sauce", "m1");
    m1.links = [];
    const m2 = Meal("Another Sauce", "m2");
    m2.links = [];
    const m3 = Meal("Another Sauce", "m3");
    m3.links = [];
    const newLinks = [m2, m3];

    LinkMeals(m1, newLinks);

    expect(m1.links).toStrictEqual(["m2", "m3"]);
    expect(m2.links).toStrictEqual(["m1"]);
    expect(m3.links).toStrictEqual(["m1"]);
  });

  it("does nothing for empty new links", () => {
    const m1 = Meal("Tomato Sauce", "m1");
    m1.links = [];
    const newLinks = [];

    LinkMeals(m1, newLinks);

    expect(m1.links).toStrictEqual([]);
  });

  it("overwrites existing links", () => {
    const m1 = Meal("Tomato Sauce", "m1");
    m1.links = ["mX", "mY"];
    const m2 = Meal("Another Sauce", "m2");
    m2.links = [];
    const newLinks = [m2];

    LinkMeals(m1, newLinks);

    expect(m1.links).toStrictEqual(["m2"]);
  });

  it("adds m1 only once", () => {
    const m1 = Meal("Tomato Sauce", "m1");
    m1.links = ["mX", "mY"];
    const m2 = Meal("Another Sauce", "m2");
    // already linked here
    m2.links = ["m1"];
    const newLinks = [m2];

    LinkMeals(m1, newLinks);

    expect(m1.links).toStrictEqual(["m2"]);
    expect(m2.links).toStrictEqual(["m1"]);
  });

  it("keeps existing links in m2", () => {
    const m1 = Meal("Tomato Sauce", "m1");
    m1.links = [];
    const m2 = Meal("Another Sauce", "m2");
    // already linked here
    m2.links = ["mX", "mY"];
    const newLinks = [m2];

    LinkMeals(m1, newLinks);

    expect(m1.links).toStrictEqual(["m2"]);
    expect(m2.links).toStrictEqual(["mX", "mY", "m1"]);
  });
});
