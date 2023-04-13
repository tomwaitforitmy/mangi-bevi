export const LinkMeals = (selectedMeal, mealsToLink) => {
  // clear links, to delete old ones
  selectedMeal.links = [];
  // add all new links
  mealsToLink.map((m) => {
    selectedMeal.links.push(m.id);
    if (!m.links.includes(selectedMeal.id)) {
      m.links.push(selectedMeal.id);
    }
  });
};
