export const listToPositions = (list) => {
  const values = Object.values(list);
  const positions = {};
  let position = 0;

  for (let i = 0; i < values.length; i++) {
    positions[values[i].id] = position;
    position += values[i].size;
  }

  return positions;
};

export const getTotalSize = (elements) => {
  let totalSize = 0;
  elements.forEach((element) => {
    totalSize += element.size;
  });
  return totalSize;
};

export const moveElement = (element, from, to) => {
  // "worklet";
  const newObject = Object.assign({}, element);

  for (const id in element) {
    if (element[id] === from) {
      newObject[id] = to;
    }

    if (element[id] === to) {
      newObject[id] = from;
    }
  }

  console.log("newObject", newObject);

  return newObject;
};

export const clamp = (value, lowerBound, upperBound) => {
  "worklet";
  return Math.max(lowerBound, Math.min(value, upperBound));
};

export const getPositionId = (absoluteY) => {
  "worklet";
  const positionId = Math.round(absoluteY / 60);
  return positionId;
};

export function sortedIndex(array, value) {
  var low = 0,
    high = array.length;

  while (low < high) {
    var mid = (low + high) >>> 1;
    if (array[mid] < value) low = mid + 1;
    else high = mid;
  }
  return low;
}

export const getPositionY = (position) => {
  "worklet";
  const y = position * 60;
  return y;
};
