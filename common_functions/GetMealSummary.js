export const GetMealSummary = (title, ingredients, steps, authorName) => {
  let summary = title + "\nIngredients:\n";
  ingredients.map((ingredient) => (summary += "- " + ingredient + "\n"));
  summary += "Steps:\n";
  steps.map((step) => (summary += "- " + step + "\n"));
  summary += "Created by " + authorName + "\n";
  return summary;
};
