export const HandleResponseError = async (response) => {
  if (!response.ok) {
    let responseData;
    try {
      responseData = await response.json();
    } catch (error) {
      responseData = null;
    }

    if (responseData && responseData.error) {
      if (typeof responseData.error === "string") {
        console.log(`### Error occurred: \n ${responseData.error}`);
      } else if (responseData.error.message) {
        console.log(`### Error occurred: \n ${responseData.error.message}`);
      } else {
        console.log("### Error occurred:", JSON.stringify(responseData.error));
      }
    } else if (responseData && responseData.message) {
      console.log(`### Error occurred: \n ${responseData.message}`);
    } else {
      console.log(
        "### Error occurred: \n",
        responseData || response.statusText || response.status,
      );
    }

    console.log(responseData);
    throw new Error(
      responseData?.error?.message ||
        responseData?.error ||
        responseData?.message ||
        `HTTP ${response.status}`,
    );
  }
};
