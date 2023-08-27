class Report {
  constructor(
    id,
    description,
    mealId,
    reporterId,
    mealTitle,
    reporterName,
    result,
    resultReason,
  ) {
    this.id = id;
    this.description = description;
    this.mealId = mealId;
    this.reporterId = reporterId;
    this.mealTitle = mealTitle;
    this.reporterName = reporterName;
    this.result = result;
    this.resultReason = resultReason;
  }
}

export default Report;
