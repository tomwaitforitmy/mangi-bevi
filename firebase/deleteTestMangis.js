import * as mealsActions from "../store/actions/mealsAction";

export async function deleteTestMangis(dispatch, allMeals, user) {
  const testMangis = allMeals.filter((m) => m.isTestMangi);

  console.log(testMangis);

  await Promise.all(
    testMangis.map(async (m) => {
      await dispatch(mealsActions.deleteMeal(m, user, allMeals));
    }),
  );
}
