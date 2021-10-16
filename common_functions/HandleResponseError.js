export const HandleResponseError = async (response) => {
  if (!response.ok) {
    const responseData = await response.json();
    console.log(`### Error occured: \n ${responseData.error.message}`);
    throw new Error(responseData.error.message);
  }
};
