export const PrepareSelectedLinks = (candidates, links) => {
  //create a local copy to not modify state (deep clone array of objects)
  const localCandidates = candidates.map((m) => ({ ...m }));
  //reset everything that might have been selected for other meal
  localCandidates.forEach((meal) => {
    meal.isSelected = false;
  });
  //mark the pre-selected meals
  if (links) {
    links.map((id) => {
      localCandidates.find((m) => m.id === id).isSelected = true;
    });
  }

  return localCandidates;
};
