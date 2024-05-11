export const RemoveDuplicates = (arrayWithDuplicates, alternativeId) => {
  let temp = {};
  let arrayWithoutDuplicates = [];
  let identifier = "id";

  if (alternativeId) {
    identifier = alternativeId;
  }

  arrayWithoutDuplicates = arrayWithDuplicates.reduce((acc, cur) => {
    if (!temp[cur[identifier]]) {
      temp[cur[identifier]] = true;
      acc.push(cur);
    }
    return acc;
  }, []);

  return arrayWithoutDuplicates;
};
