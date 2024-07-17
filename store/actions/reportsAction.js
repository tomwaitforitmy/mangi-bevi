import { HandleResponseError } from "../../common_functions/HandleResponseError";
import Report from "../../models/Report";
import * as authAction from "./authAction";

export const CREATE_REPORT = "CREATE_REPORT";
export const SET_REPORTS = "SET_REPORTS";

export const fetchReports = () => {
  return async (dispatch) => {
    console.log("Begin fetch Reports");
    try {
      const response = await fetch(
        "https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/reports.json",
      );

      await HandleResponseError(response);

      const responseData = await response.json();
      const loadedReports = [];

      for (const key in responseData) {
        loadedReports.push(
          new Report(
            key,
            responseData[key].description,
            responseData[key].mangiId,
            responseData[key].reporterId,
            responseData[key].mangiName,
            responseData[key].reporterName,
            responseData[key].result,
            responseData[key].resultReason,
          ),
        );
      }

      dispatch({
        type: SET_REPORTS,
        reports: loadedReports,
      });
    } catch (error) {
      throw error;
    }
  };
};

const replacer = (key, value) => {
  if (key === "id") {
    return undefined;
  } else {
    return value;
  }
};

export const createReport = (report) => {
  return async (dispatch) => {
    console.log("Begin create Report");
    const token = await authAction.getToken();

    const response = await fetch(
      `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/reports.json?auth=${token}`,
      {
        method: "POST",
        header: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(report, replacer),
      },
    );

    await HandleResponseError(response);

    const responseData = await response.json();

    report = { ...report, id: responseData.name };

    console.log("End create Report");

    dispatch({ type: CREATE_REPORT, report: report });

    return responseData.name;
  };
};
