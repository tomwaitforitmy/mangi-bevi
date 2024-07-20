import {
  FILTER_MODE_AND,
  FILTER_MODE_OR,
  TagFilterMeals,
} from "../../common_functions/TagFilterMeals.js";
import { ZATARMEALS } from "../../data/DummyMeals.js";

describe("TagFilterMeals", () => {
  it("finds 3 meals with tag -MwD2GS0FdbqWp1kCqmg inside ZATARMEALS", () => {
    const tagIdsToFilter = ["-MwD2GS0FdbqWp1kCqmg"];
    const filteredMeals = TagFilterMeals(ZATARMEALS, tagIdsToFilter);

    expect(filteredMeals.length).toBe(3);
  });

  it("finds 3 meals with tag -NLVn3SOLkC1lJOXoLbo inside ZATARMEALS", () => {
    const tagIdsToFilter = ["-NLVn3SOLkC1lJOXoLbo"];
    const filteredMeals = TagFilterMeals(ZATARMEALS, tagIdsToFilter);

    expect(filteredMeals.length).toBe(1);
  });

  it("finds 0 meals with some tag id inside ZATARMEALS", () => {
    const tagIdsToFilter = ["no useful tag id"];
    const filteredMeals = TagFilterMeals(ZATARMEALS, tagIdsToFilter);

    expect(filteredMeals.length).toBe(0);
  });

  it("finds 1 meal with two tags in AND_MODE inside ZATARMEALS", () => {
    const tagIdsToFilter = ["-NLVn3SOLkC1lJOXoLbo", "-MwD2GS0FdbqWp1kCqmg"];
    const filteredMeals = TagFilterMeals(
      ZATARMEALS,
      tagIdsToFilter,
      FILTER_MODE_AND,
    );

    expect(filteredMeals.length).toBe(1);
  });

  it("finds 3 meal with two tags in OR_MODE inside ZATARMEALS", () => {
    const tagIdsToFilter = ["-NLVn3SOLkC1lJOXoLbo", "-MwD2GS0FdbqWp1kCqmg"];
    const filteredMeals = TagFilterMeals(
      ZATARMEALS,
      tagIdsToFilter,
      FILTER_MODE_OR,
    );

    expect(filteredMeals.length).toBe(3);
  });

  it("does nothing without tags", () => {
    const tagIdsToFilter = [];
    const filteredMeals = TagFilterMeals(ZATARMEALS, tagIdsToFilter);

    expect(filteredMeals.length).toBe(ZATARMEALS.length);
  });
});
