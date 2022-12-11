import UserStats from "../models/UserStats";

export const GetUserStats = (userMeals, userId) => {
  const result = new UserStats(userId, 0, 0, 0, false);

  if (userMeals.length > 0) {
    userMeals.map((meal) => {
      result.countTags += meal.tags.length;
      result.countSteps += meal.steps.length;
      result.countIngredients += meal.ingredients.length;
    });
    result.experiencedUser = userMeals.length > 1;
  }

  return result;
};
