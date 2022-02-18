export const HandleResponseError = async (response) => {
  if (!response.ok) {
    const responseData = await response.json();
    console.log(`### Error occured: \n ${responseData.error.message}`);
    console.log(responseData);
    throw new Error(responseData.error.message);
  }
};
