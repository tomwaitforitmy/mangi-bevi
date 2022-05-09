import MovableData from "../models/MovableData";

export const listToPositions = (list) => {
  const values = Object.values(list);
  const positions = {};
  let position = 0;

  for (let i = 0; i < values.length; i++) {
    positions[values[i].id] = position + values[i].size * 0.5;
    position += values[i].size;
  }

  return positions;
};

export const CreateMovableDataArray = (elements) => {
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

export const CreateFake = (elements) => {
  const array = [];
  let position = 0;
  elements.map((element, index) => {
    const data = new MovableData(
      index,
      "Fake",
      60,
      index,
      position,
      position + 60 * 0.5
    );
    array.push(data);
    position += 60;
  });

  return array;
};

export const swapElement = (positions, from, to) => {
  "worklet";
  let clonedArray = JSON.parse(JSON.stringify(positions));

  // let clonedArray = [];

  // positions.forEach((element) => {
  //   clonedArray.push(element);
  // });

  clonedArray[from].position = positions[to].position;
  clonedArray[to].position = positions[from].position;
  clonedArray[from].threshold = positions[to].threshold;
  clonedArray[to].threshold = positions[from].threshold;
  clonedArray[from].order = positions[to].order;
  clonedArray[to].order = positions[to].order;

  return clonedArray;

  // const array = [];
  // let position = 0;
  // let id = 0;
  // let height = 0;
  // let title = "empty";

  // positions.forEach((element) => {
  //   if (element.order === from.order) {
  //     console.log("swapping");
  //     id = to.id;
  //     title = to.title;
  //     height = to.height;
  //     console.log("element.title", element.title);
  //     console.log("title", title);
  //   } else if (element.order === to.order) {
  //     id = from.id;
  //     title = from.title;
  //     height = from.height;
  //   } else {
  //     id = element.id;
  //     title = element.title;
  //     height = element.height;
  //   }
  //   const data = new MovableData(
  //     id,
  //     title,
  //     height,
  //     element.order,
  //     position,
  //     position + height * 0.5
  //   );
  //   array.push(data);
  //   position += height;
  // });

  // console.log("array", array);

  // return array;
};

export const getTotalSize = (elements) => {
  let totalSize = 0;
  elements.forEach((element) => {
    totalSize += element.size;
  });
  return totalSize;
};

export const moveElement = (elements, from, to) => {
  // "worklet";
  const newObject = Object.assign({}, elements);

  // console.log("newObject before move", newObject);

  newObject[from] = elements[to];
  newObject[to] = elements[from];

  // console.log("newObject after move", newObject);

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

function compareThresholds(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

export function sortedIndex(array, value) {
  // console.log("sorted array", array);

  array.sort(compareThresholds);

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
