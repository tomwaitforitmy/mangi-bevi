import { LinkMeals } from "../common_functions/LinkMeals";
import { UnlinkMeals } from "../common_functions/UnlinkMeals";
import * as mealsActions from "../store/actions/mealsAction";

export async function editLinks(
  dispatch,
  selectedMeal,
  mealsToLink,
  candidates,
) {
  //create a copy to avoid state corruption
  const editedMeal = { ...selectedMeal };
  //links as they were before this edit - needed so editLinks can tell a
  //removal apart from "was never linked" (see mealsAction.js editLinks)
  const originalEditedMealLinks = editedMeal.links;
  //Because we have an array of objects [meals] containing an array of mealIds [m1.friends, m2.friends, ...]
  //we need to deep copy everything here to avoid state corruptions.
  const localMealsToLink = JSON.parse(JSON.stringify(mealsToLink));
  //snapshot before LinkMeals mutates these arrays in place
  const originalLinksByMealId = new Map(
    localMealsToLink.map((m) => [m.id, [...m.links]]),
  );

  //update the actual link arrays correctly
  const mealsToRemoveLinks = UnlinkMeals(
    editedMeal,
    localMealsToLink,
    candidates,
  );

  LinkMeals(editedMeal, localMealsToLink);

  //first edit all meals that are linked to the selected
  await Promise.all(
    localMealsToLink.map(async (item) => {
      await dispatch(
        mealsActions.editLinks(item, originalLinksByMealId.get(item.id)),
      );
    }),
  );

  //second, remove all old links
  await Promise.all(
    mealsToRemoveLinks.map(async (item) => {
      await dispatch(mealsActions.editLinks(item, item.originalLinks));
    }),
  );

  //third, edit the meal that was selected
  return await dispatch(
    mealsActions.editLinks(editedMeal, originalEditedMealLinks),
  );
}
