export const IsMealInvalid = (meal) => {
  //Give a title and valid arrays
  if (!meal.title || !meal.ingredients || !meal.steps) {
    return true;
  }

  return IsFormInvalid(meal.title, meal.ingredients, meal.steps);
};

export const IsFormInvalid = (title, ingredients, steps) => {
  //Give a title and valid arrays
  if (!title || !ingredients || !steps) {
    return true;
  }

  //At least one ingredient and one step
  if (ingredients.length < 1 || steps.length < 1) {
    return true;
  }

  return false;
};
