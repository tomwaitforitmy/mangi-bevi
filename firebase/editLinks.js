import { LinkMeals } from "../common_functions/LinkMeals";
import { UnlinkMeals } from "../common_functions/UnlinkMeals";
import * as mealsActions from "../store/actions/mealsAction";

export async function editLinks(dispatch, selMeal, mealsToLink, candidates) {
  const [selectedMeal, changedMeals] = UnlinkMeals(
    selMeal,
    mealsToLink,
    candidates,
  );
  LinkMeals(selectedMeal, mealsToLink);

  //first edit all meals that are linked to the selected
  await Promise.all(
    mealsToLink.map(async (item) => {
      await dispatch(mealsActions.editLinks(item));
    }),
  );

  //second, remove all old links
  await Promise.all(
    changedMeals.map(async (item) => {
      await dispatch(mealsActions.editLinks(item));
    }),
  );

  //third, edit the meal that was selected
  return await dispatch(mealsActions.editLinks(selectedMeal));
}
