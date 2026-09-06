export function ContainsArray(myArray) {
  if (!Array.isArray(myArray)) {
    return false;
  }
  return myArray.some((item) => Array.isArray(item));
}
