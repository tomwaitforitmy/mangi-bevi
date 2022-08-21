import MovableData from "../../models/MovableData";

export const CreateMovableDataArray = (elements) => {
  "worklet";
  const array = [];
  let position = 0;
  elements.map((element, index) => {
    const data = new MovableData(
      index,
      element.title,
      element.size,
      index,
      position,
      position + element.size * 0.5
    );
    array.push(data);
    position += element.size;
  });

  return array;
};

export const swapElementWithLowerOrder = (positions, from, to) => {
  "worklet";
  let clonedArray = JSON.parse(JSON.stringify(positions));

  clonedArray[from].order = positions[to].order;
  clonedArray[from].position = positions[to].position;
  clonedArray[from].threshold =
    clonedArray[from].position + clonedArray[from].height * 0.5;

  clonedArray[to].order = positions[from].order;
  clonedArray[to].position = positions[to].position + positions[from].height;
  clonedArray[to].threshold =
    clonedArray[to].position + clonedArray[to].height * 0.5;

  return clonedArray;
};

export const swapElementWithHigherOrder = (positions, from, to) => {
  "worklet";
  let clonedArray = JSON.parse(JSON.stringify(positions));

  clonedArray[from].order = positions[to].order;
  clonedArray[from].position = positions[from].position + positions[to].height;
  clonedArray[from].threshold =
    clonedArray[from].position + clonedArray[from].height * 0.5;

  clonedArray[to].order = positions[from].order;
  clonedArray[to].position = positions[from].position;
  clonedArray[to].threshold =
    clonedArray[to].position + clonedArray[to].height * 0.5;

  return clonedArray;
};

export const getTotalSize = (elements) => {
  "worklet";
  let totalSize = 0;
  elements.forEach((element) => {
    totalSize += element.size;
  });
  return totalSize;
};

export const clamp = (value, lowerBound, upperBound) => {
  "worklet";
  return Math.max(lowerBound, Math.min(value, upperBound));
};

function compareThresholds(a, b) {
  "worklet";
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

export function sortedIndex(array, value) {
  "worklet";
  array.sort(compareThresholds);

  var low = 0,
    high = array.length;

  while (low < high) {
    var mid = (low + high) >>> 1;
    if (array[mid] < value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}
