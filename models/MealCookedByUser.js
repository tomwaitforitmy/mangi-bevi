const MealCookedByUser = (id, mealId, userId) => ({
  id,
  mealId,
  userId,
  date: new Date().toISOString(),
});

export default MealCookedByUser;
