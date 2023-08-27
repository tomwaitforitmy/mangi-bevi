export const PrepareSelectedLinks = (candidates, links) => {
  // reset everything that might have been selected for other meal
  candidates.forEach((meal) => {
    meal.isSelected = false;
  });

  if (links) {
    links.map((id) => {
      candidates.find((m) => m.id === id).isSelected = true;
    });
  }

  return candidates;
};
