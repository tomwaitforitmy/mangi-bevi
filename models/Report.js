class Report {
  constructor(
    id,
    description,
    mangiId,
    reporterId,
    mangiName,
    reporterName,
    result,
    resultReason,
  ) {
    this.id = id;
    this.description = description;
    this.mangiId = mangiId;
    this.reporterId = reporterId;
    this.mangiName = mangiName;
    this.reporterName = reporterName;
    this.result = result;
    this.resultReason = resultReason;
  }
}

export default Report;
