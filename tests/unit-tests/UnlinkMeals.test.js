import { UnlinkMeals } from "../../common_functions/UnlinkMeals.js";
import Meal from "../../models/Meal.js";

describe("UnlinkMeals", () => {
  it("keeps links if nothing changes", () => {
    const m1 = Meal("Tomato Sauce", "m1");
    m1.links = ["m2"];
    const m2 = Meal("Another Sauce", "m2");
    m2.links = ["m1"];
    const newLinks = [m2];
    const mealsToRemoveLinks = UnlinkMeals(m1, newLinks, newLinks);

    //m2 should not be touched
    expect(mealsToRemoveLinks).toStrictEqual([]);
  });

  it("Exchanges m2 and m3 to m4, deletes in m2.links and m3.links", () => {
    const m1 = Meal("Tomato Sauce", "m1");
    m1.links = ["m2", "m3"];
    const m2 = Meal("Another Sauce", "m2");
    m2.links = ["m1"];
    const m3 = Meal("Another Sauce", "m3");
    m3.links = ["m1"];
    const m4 = Meal("Another Sauce", "m4");
    m4.links = [];
    const newLinks = [m4];
    const candidates = [m2, m3, m4];
    const mealsToRemoveLinks = UnlinkMeals(m1, newLinks, candidates);

    expect(mealsToRemoveLinks.find((m) => m.id === "m2").links).toStrictEqual(
      [],
    );
    expect(mealsToRemoveLinks.find((m) => m.id === "m3").links).toStrictEqual(
      [],
    );
    //m4 should not be touched
    expect(mealsToRemoveLinks.find((m) => m.id === "m4")).toBeFalsy();
  });

  it("deletes old links if no links are selected", () => {
    const m1 = Meal("Tomato Sauce", "m1");
    m1.links = ["m2", "m3"];
    const m2 = Meal("Another Sauce", "m2");
    m2.links = ["m1"];
    const m3 = Meal("Another Sauce", "m3");
    m3.links = ["m1"];
    const m4 = Meal("Another Sauce", "m4");
    m4.links = ["mx"];
    const newLinks = [];
    const candidates = [m2, m3, m4];
    const mealsToRemoveLinks = UnlinkMeals(m1, newLinks, candidates);

    expect(mealsToRemoveLinks.find((m) => m.id === "m2").links).toStrictEqual(
      [],
    );
    expect(mealsToRemoveLinks.find((m) => m.id === "m3").links).toStrictEqual(
      [],
    );
    //m4 should not be touched
    expect(mealsToRemoveLinks.find((m) => m.id === "m4")).toBeFalsy();
  });

  it("deletes links if they are unselected and keeps others", () => {
    const m1 = Meal("Tomato Sauce", "m1");
    m1.links = ["m2", "m3", "m4"];
    const m2 = Meal("Another Sauce", "m2");
    m2.links = ["m1"];
    const m3 = Meal("Another Sauce", "m3");
    m3.links = ["m1"];
    const m4 = Meal("Another Sauce", "m4");
    m4.links = ["m1"];
    const newLinks = [m2, m4];
    const candidates = [m2, m3, m4];
    const mealsToRemoveLinks = UnlinkMeals(m1, newLinks, candidates);

    expect(mealsToRemoveLinks.find((m) => m.id === "m2")).toBeFalsy();
    //m3 should be deleted
    expect(mealsToRemoveLinks.find((m) => m.id === "m3").links).toStrictEqual(
      [],
    );
    expect(mealsToRemoveLinks.find((m) => m.id === "m4")).toBeFalsy();
  });

  it("deletes links, but keeps the links that have nothing to do with it", () => {
    const m1 = Meal("Tomato Sauce", "m1");
    m1.links = ["m2", "m3", "m4"];
    const m2 = Meal("Another Sauce", "m2");
    m2.links = ["m1"];
    const m3 = Meal("Another Sauce", "m3");
    m3.links = ["m1", "mx"];
    const m4 = Meal("Another Sauce", "m4");
    m4.links = ["m1", "mx"];
    const newLinks = [m2, m4];
    const candidates = [m2, m3, m4];
    const changedMeals = UnlinkMeals(m1, newLinks, candidates);

    expect(changedMeals.find((m) => m.id === "m2")).toBeFalsy();
    expect(changedMeals.find((m) => m.id === "m3").links).toStrictEqual(["mx"]);
    expect(changedMeals.find((m) => m.id === "m4")).toBeFalsy();
  });
});
