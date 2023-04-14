export const UnlinkMeals = (selectedMeal, newLinks, candidates) => {
  const newLinkIds = newLinks.map((m) => m.id);
  const oldLinkIds = selectedMeal.links;
  const linksToRemove = [];

  //find links that we have to remove
  oldLinkIds.map((l) => {
    if (!newLinkIds.includes(l)) {
      linksToRemove.push(l);
    }
  });

  //actually delete the links from list of candidates
  linksToRemove.map((deleteLink) => {
    const mealWithLinkToRemove = candidates.find((m) => m.id === deleteLink);
    const updatedLinks = mealWithLinkToRemove.links.filter(
      (l) => l !== selectedMeal.id,
    );
    mealWithLinkToRemove.links = updatedLinks;
  });

  return candidates;
};
