const MealCookedByUser = (id, mealId, userId, date) => ({
  id,
  mealId,
  userId,
  date: date ? date : new Date().toISOString(),
});

export default MealCookedByUser;
