export const GetAuthorNameByMealId = (mealId, users) => {
  const author = GetAuthorByMealId(mealId, users);
  return author.name;
};

export const GetAuthorName = (userId, users) => {
  const author = GetAuthor(userId, users);
  return author.name;
};

export const GetAuthor = (userId, users) => {
  const author = users.find((user) => user.id === userId);
  return author;
};

export const GetAuthorByMealId = (mealId, users) => {
  const author = users.find((user) => user.meals.includes(mealId));
  return author;
};
