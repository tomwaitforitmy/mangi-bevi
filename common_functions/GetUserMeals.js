import { DEV_MODE } from "../data/Environment";

export const GetUserMeals = (meals, userMeals) => {
  const result = [];
  userMeals.map((id) => {
    const found = meals.find((m) => m.id === id);
    if (found) {
      result.push(found);
    } else {
      if (DEV_MODE) {
        console.error("Error! Could not find meal id '" + id + "' in meals");
      } else {
        console.log("Error! Could not find meal id '" + id + "' in meals");
      }
    }
  });

  return result;
};
