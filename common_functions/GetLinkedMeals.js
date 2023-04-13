export const GetLinkedMeals = (candidates, linkIds) => {
  const results = [];
  if (linkIds) {
    linkIds.map((id) => {
      const found = candidates.find((meal) => meal.id === id);
      if (found) {
        results.push(found);
      }
    });
  }

  return results;
};
