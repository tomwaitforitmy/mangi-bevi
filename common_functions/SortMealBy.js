// Sorting function by reactions (most reactions first)
export const SortMealsByReactions = (meals) => {
  return meals.sort((a, b) => b.reactions.length - a.reactions.length);
};

// Sorting function by most cooked
export const SortMealsByMostCooked = (meals, mealCookedByUsers) => {
  // Map to store cook count for each meal (mealId)
  const cookCountMap = mealCookedByUsers.reduce((map, cooked) => {
    // Use mealId to count how many times the meal was cooked
    const mealId = cooked.mealId;

    if (!map[mealId]) {
      map[mealId] = 1; // First time seeing this mealId, set count to 1
    } else {
      map[mealId]++; // Increment the count for this mealId
    }

    return map; // Return the updated map after each iteration
  }, {});

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
