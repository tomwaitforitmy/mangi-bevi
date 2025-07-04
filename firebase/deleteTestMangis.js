import * as mealsActions from "../store/actions/mealsAction";

export async function deleteTestMangis(dispatch, allMeals, user) {
  const testMangis = allMeals.filter((m) => m.isTestMangi);

  // Process deletions sequentially to avoid race conditions
  let updatedUser = user;
  for (const meal of testMangis) {
    updatedUser = await dispatch(
      mealsActions.deleteMeal(meal, updatedUser, allMeals),
    );
  }
}
