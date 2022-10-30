export const GetLevelPercent = (lowerThreshold, upperThreshold, value) => {
  const max = upperThreshold - lowerThreshold;
  const normedValued = value - lowerThreshold;
  const onePercent = max / 100;

  return normedValued / onePercent / 100;
};
