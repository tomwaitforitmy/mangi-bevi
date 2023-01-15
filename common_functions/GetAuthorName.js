export const GetAuthorNameByMealId = (mealId, users) => {
  const author = users.find((user) => user.meals.includes(mealId));
  return author.name;
};

export const GetAuthorName = (userId, users) => {
  const author = users.find((user) => user.id === userId);
  return author.name;
};
