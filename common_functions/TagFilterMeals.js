export const TagFilterMeals = (allMeals, tagIdsToFilter, filterOr = true) => {
  if (!tagIdsToFilter || tagIdsToFilter.length < 1) {
    return allMeals;
  }

  let filteredMeals = [];

  if (filterOr) {
    filterOrMode(allMeals, tagIdsToFilter, filteredMeals);
  } else {
    filterAndMode(allMeals, tagIdsToFilter, filteredMeals);
  }

  return filteredMeals;
};

function filterOrMode(allMeals, tagIdsToFilter, filteredMeals) {
  allMeals.map((meal) => {
    if (tagIdsToFilter.some((e) => meal.tags.includes(e))) {
      filteredMeals.push(meal);
    }
  });
}

function filterAndMode(allMeals, tagIdsToFilter, filteredMeals) {
  allMeals.map((meal) => {
    if (!tagIdsToFilter.some((id) => !meal.tags.includes(id))) {
      filteredMeals.push(meal);
    }
  });
}
