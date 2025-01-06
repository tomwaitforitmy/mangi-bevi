import MealCookedByUser from "../../models/MealCookedByUser";

import {
  SortMealsByReactions,
  SortMealsByMostCooked,
  SortMealsByAuthor,
} from "../../common_functions/SortMealBy.js";
import { TEN_MEALS } from "../../data/DummyMeals";

describe("Meal Sorting", () => {
  let meals;
  let mealCookedByUsers;

  beforeEach(() => {
    meals = TEN_MEALS;

    mealCookedByUsers = [
      MealCookedByUser(1, "user1", "-O9dWdeSlKRenhA5moUD"),
      MealCookedByUser(1, "user2", "-O9dWdeSlKRenhA5moUD"),
      MealCookedByUser(3, "user2", "-O9dWdeSlKRenhA5moUD"),
      MealCookedByUser(4, "user2", "-O9dWdeSlKRenhA5moUD"),
      MealCookedByUser(5, "user2", "-O9dWdeSlKRenhA5moUD"),
      MealCookedByUser(6, "user2", "-O9dWdeSlKRenhA5moUD"),
      MealCookedByUser(7, "user2", "-O9dWdeSlKRenhA5moUD"),
      MealCookedByUser(8, "user2", "-O95A6SLUx-q-bEChNmr"),
      MealCookedByUser(9, "user2", "-O95A6SLUx-q-bEChNmr"),
      MealCookedByUser(10, "user2", "-O96lVbmhYF56eQAsrBK"),
    ];
  });

  test("should sort meals by the number of reactions (most reactions first)", () => {
    const sortedMeals = SortMealsByReactions(meals);

    expect(sortedMeals[0].id).toBe("-O96jK9fk5gbb5DxLKDI"); // 3 reactions
    expect(sortedMeals[1].id).toBe("-O95A6SLUx-q-bEChNmr"); // 2 reactions
    expect(sortedMeals[2].id).toBe("-O8rSu4bN04LHRmZe0M7"); // 2 reactions
    expect(sortedMeals[3].id).toBe("-O96lVbmhYF56eQAsrBK"); // 1 reaction
    expect(sortedMeals[4].id).toBe("-O8W4xIygoGTV7RiecjV"); // 1 reaction
  });

  test.only("should sort meals by the most cooked (most cooked first)", () => {
    const sortedMeals = SortMealsByMostCooked(meals, mealCookedByUsers);

    expect(sortedMeals[0].id).toBe("-O9dWdeSlKRenhA5moUD"); // cooked 7 times
    expect(sortedMeals[1].id).toBe("-O95A6SLUx-q-bEChNmr"); // cooked 2 times
    expect(sortedMeals[2].id).toBe("-O96lVbmhYF56eQAsrBK"); // cooked 1 times
  });

  test("should sort meals by created by active user first", () => {
    const authorId = "-N7fTSUz_WVEjEruisQV";
    const sortedMeals = SortMealsByAuthor(meals, authorId);

    expect(sortedMeals[0].authorId).toBe(authorId);
    expect(sortedMeals[1].authorId).toBe(authorId);
    expect(sortedMeals[2].authorId).toBe(authorId);
    //Created by someone else
    expect(sortedMeals[3].authorId).toBe("-NZRfsbwxMKodyQA2ew6");
    expect(sortedMeals[4].authorId).toBe("-NZRfsbwxMKodyQA2ew6");
  });
});