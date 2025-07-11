export const BASE =
  "https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/";

export const getUserUrl = (id, token) => {
  return BASE + `users/${id}.json?auth=${token}`;
};

export const getUsersUrl = (token) => {
  return BASE + `users.json?auth=${token}`;
};

export const getMealUrl = (id, token) => {
  return BASE + `meals/${id}.json?auth=${token}`;
};

export const getMealsUrl = (token) => {
  return BASE + `meals.json?auth=${token}`;
};

export const getPublicMealsUrl = () => {
  return BASE + "meals.json";
};

export const getTagsUrl = (token) => {
  return BASE + `tags.json?auth=${token}`;
};

export const getTagUrl = (id, token) => {
  return BASE + `meals/${id}.json?auth=${token}`;
};

export const getMealsCookedByUserUrl = (token) => {
  return BASE + `mealCookedByUser.json?auth=${token}`;
};

export const getMealCookedByUserUrl = (mealId, token) => {
  return BASE + `mealCookedByUser.json?mealId=${mealId}&auth=${token}`;
};

export const getReportsUrl = (token) => {
  return BASE + `reports.json?auth=${token}`;
};
