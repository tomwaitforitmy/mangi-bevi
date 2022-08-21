export const ConvertArrayToArrayOfObjects = (array) => {
  const initialValue = {};
  return array.map((text, index) => {
    return {
      id: index.toString(),
      title: text,
    };
  }, initialValue);
};
