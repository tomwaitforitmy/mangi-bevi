export const GetMealSummary = (title, ingredients, steps) => {
  let summary = title + "\nIngredients:\n";
  ingredients.map((ingredient) => (summary += "- " + ingredient + "\n"));
  summary += "Steps:\n";
  steps.map((step) => (summary += "- " + step + "\n"));
  return summary;
};
