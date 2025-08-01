export const WasMarkedThisWeek = (mealCookedByUser, mealId, userId, today) => {
  //meal was never marked
  if (!Array.isArray(mealCookedByUser) || !mealCookedByUser.length) {
    return false;
  }
  let marksByUser = mealCookedByUser.filter(
    (m) => m.mealId === mealId && m.userId === userId,
  );
  //user never marked this meal
  if (!Array.isArray(marksByUser) || !marksByUser.length) {
    return false;
  }

  //pick the newest date in the list of candidates
  let candidate = new Date(
    Math.max(...marksByUser.map((e) => new Date(e.date))),
  );

  candidate.setDate(candidate.getDate() + 7);

  if (candidate < today) {
    return false;
  }

  return true;
};
