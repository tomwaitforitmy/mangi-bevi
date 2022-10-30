class Level {
  constructor(
    lowerThreshold,
    upperThreshold,
    value,
    currentTitle,
    nextTitle,
    percent,
  ) {
    this.lowerThreshold = lowerThreshold;
    this.upperThreshold = upperThreshold;
    this.value = value;
    this.currentTitle = currentTitle;
    this.nextTitle = nextTitle;
    this.percent = percent;
  }
}

export default Level;
