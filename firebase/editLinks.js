import { LinkMeals } from "../common_functions/LinkMeals";
import * as mealsActions from "../store/actions/mealsAction";

export async function editLinks(dispatch, selectedMeal, mealsToLink) {
  LinkMeals(selectedMeal, mealsToLink);

  //first edit all meals that are linked to the selected
  await Promise.all(
    mealsToLink.map(async (item) => {
      await dispatch(mealsActions.editLinks(item));
    }),
  );
  //second edit the meal that was selected
  return await dispatch(mealsActions.editLinks(selectedMeal));
}
