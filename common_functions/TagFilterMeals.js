import { FILTER_MODE_AND, FILTER_MODE_OR } from "../store/actions/tagsAction";

export const TagFilterMeals = (allMeals, tagIdsToFilter, filterMode) => {
  if (!tagIdsToFilter || tagIdsToFilter.length < 1) {
    return allMeals;
  }
  //check for default mode
  if (!filterMode) {
    filterMode = FILTER_MODE_OR;
  }

  let filteredMeals = [];

  switch (filterMode) {
    case FILTER_MODE_AND: {
      filterAndMode(allMeals, tagIdsToFilter, filteredMeals);
      break;
    }
    case FILTER_MODE_OR: {
      filterOrMode(allMeals, tagIdsToFilter, filteredMeals);
      break;
    }

    default:
      throw new Error("Invalid filter mode for tags! Mode is " + filterMode);
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
