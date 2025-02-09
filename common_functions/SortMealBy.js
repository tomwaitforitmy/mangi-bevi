import {
  COOKED_BY_ME,
  FIRST_CREATED,
  FIRST_EDITED,
  LAST_CREATED,
  LAST_EDITED,
  MOST_COOKED,
  MOST_REACTIONS,
} from "../data/AllowedSortingOptions";

// Sorting function by reactions (most reactions first)
export const SortMealsByReactions = (meals) => {
  return meals.sort((a, b) => b.reactions.length - a.reactions.length);
};

// Sorting function by most cooked
export const SortMealsByMostCooked = (meals, mealCookedByUsers) => {
  // Map to store cook count for each meal (mealId)
  //Start with an empty object
  const cookCountMap = mealCookedByUsers.reduce((map, cooked) => {
    const mealId = cooked.mealId;
    //if the mealId exists, we add +1 to the count
    //if it does not exist, it returns undefined
    //therefore, we check that with || 0
    map[mealId] = (map[mealId] || 0) + 1;
    return map;
  }, {}); //Start with an empty object as initial value {}

  // Sort meals by the cook count (most cooked first)
  return meals.sort(
    (a, b) => (cookCountMap[b.id] || 0) - (cookCountMap[a.id] || 0),
  );
};

// Sorting function by active user first
export const SortMealsByAuthor = (meals, authorId) => {
  return meals.sort(
    (a, b) =>
      (b.authorId === authorId ? 1 : 0) - (a.authorId === authorId ? 1 : 0),
  );
};

const SortMealsByNewest = (meals) => {
  return meals.sort(
    (a, b) => new Date(b.creationDate) - new Date(a.creationDate),
  );
};

const SortMealsByOldest = (meals) => {
  return meals.sort(
    (a, b) => new Date(a.creationDate) - new Date(b.creationDate),
  );
};

const SortMealsByNewestEdit = (meals) => {
  return meals.sort((a, b) => new Date(b.editDate) - new Date(a.editDate));
};

const SortMealsByOldestEdit = (meals) => {
  return meals.sort((a, b) => new Date(a.editDate) - new Date(b.editDate));
};

export const SortMealsBy = (meals, sortingType, mealCookedByUsers, userId) => {
  switch (sortingType) {
    case LAST_CREATED:
      return SortMealsByNewest(meals);
    case FIRST_CREATED:
      return SortMealsByOldest(meals);
    case LAST_EDITED:
      return SortMealsByNewestEdit(meals);
    case FIRST_EDITED:
      return SortMealsByOldestEdit(meals);
    case MOST_COOKED:
      return SortMealsByMostCooked(meals, mealCookedByUsers);
    case MOST_REACTIONS:
      return SortMealsByReactions(meals);
    case COOKED_BY_ME:
      return SortMealsByAuthor(meals, userId);
    default:
      break;
  }
};
