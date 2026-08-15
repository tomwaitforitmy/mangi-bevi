export const UnlinkMeals = (selectedMeal, newLinks, candidates) => {
  const newLinkIds = newLinks.map((m) => m.id);
  const oldLinkIds = selectedMeal.links;
  const linksToRemove = [];
  const mealsToRemoveLinks = [];

  //find links that we have to remove
  oldLinkIds.map((l) => {
    if (!newLinkIds.includes(l)) {
      linksToRemove.push(l);
    }
  });

  //actually delete the links from list of candidates
  linksToRemove.map((deleteLink) => {
    const mealWithLinkToRemove = candidates.find((m) => m.id === deleteLink);
    const originalLinks = mealWithLinkToRemove.links;
    const updatedLinks = originalLinks.filter((l) => l !== selectedMeal.id);
    mealWithLinkToRemove.links = updatedLinks;
    //callers need this to tell the server "these were removed", not just "here's the new list"
    mealWithLinkToRemove.originalLinks = originalLinks;
    mealsToRemoveLinks.push(mealWithLinkToRemove);
  });

  return mealsToRemoveLinks;
};
