import { FastFilterMeals } from "../../common_functions/FastFilterMeals.js";
import { ZATARMEALS } from "../../data/DummyMeals.js";

describe("FastFilterMeals", () => {
  it("finds 2 meals with feta inside ZATARMEALS", () => {
    const searchTerm = "feta";
    const filteredMeals = FastFilterMeals(ZATARMEALS, searchTerm);

    expect(filteredMeals.length).toBe(2);
  });
  it("finds 2 meals with FETA inside ZATARMEALS", () => {
    const searchTerm = "FETA";
    const filteredMeals = FastFilterMeals(ZATARMEALS, searchTerm);

    expect(filteredMeals.length).toBe(2);
  });
  it("returns same size if term is empty", () => {
    const searchTerm = "";
    const filteredMeals = FastFilterMeals(ZATARMEALS, searchTerm);

    expect(filteredMeals.length).toBe(4);
  });
  it("returns same size if term is null", () => {
    const searchTerm = null;
    const filteredMeals = FastFilterMeals(ZATARMEALS, searchTerm);

    expect(filteredMeals.length).toBe(4);
  });
  it("finds 4 meals with atar inside ZATARMEALS", () => {
    const searchTerm = "atar";
    const filteredMeals = FastFilterMeals(ZATARMEALS, searchTerm);

    expect(filteredMeals.length).toBe(4);
  });
  it("finds 1 meal with aubergin inside ZATARMEALS", () => {
    const searchTerm = "aubergin";
    const filteredMeals = FastFilterMeals(ZATARMEALS, searchTerm);

    expect(filteredMeals.length).toBe(1);
  });
  it("finds 0 meals with super inside ZATARMEALS", () => {
    const searchTerm = "super";
    const filteredMeals = FastFilterMeals(ZATARMEALS, searchTerm);

    expect(filteredMeals.length).toBe(0);
  });
});
