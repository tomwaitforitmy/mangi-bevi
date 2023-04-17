export const FastFilterMeals = (allMeals, searchTerm) => {
  if (!searchTerm) {
    return allMeals;
  }
  const lowerCaseSearch = searchTerm.toLowerCase();
  const lessMeals = allMeals.filter(
    (m) =>
      m.title.toLowerCase().includes(lowerCaseSearch) ||
      m.ingredients.some(
        (i) =>
          typeof i === "string" && i.toLowerCase().includes(lowerCaseSearch),
      ) ||
      m.steps.some(
        (i) =>
          typeof i === "string" && i.toLowerCase().includes(lowerCaseSearch),
      ),
  );
  return lessMeals;
};
