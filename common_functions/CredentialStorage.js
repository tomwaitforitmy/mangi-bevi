import AsyncStorage from "@react-native-async-storage/async-storage";

export const LoadToken = async () => {
  const tokenData = await AsyncStorage.getItem(TOKEN);
  if (!tokenData) {
    return;
  }

  const transformedData = JSON.parse(tokenData);
  //typo here: but it was always saved like this!
  const { token, userId, expericationDate: expirationDate } = transformedData;
  const expirationDateTransformed = new Date(expirationDate);

  if (expirationDateTransformed <= new Date() || !token || !userId) {
    return;
  }

  const expirationTime =
    expirationDateTransformed.getTime() - new Date().getTime();

  return { token, userId, expirationTime };
};

export const LoadCredentials = async () => {
  const credentials = await AsyncStorage.getItem(CREDENTIALS);

  if (!credentials) {
    console.log("Found no credentials!");
    return;
  }

  const transformedData = JSON.parse(credentials);
  const { email, password } = transformedData;

  return { email, password };
};

export const SaveTokenDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    TOKEN,
    JSON.stringify({
      token: token,
      userId: userId,
      //typo here: but it was always saved like this!
      expericationDate: expirationDate.toISOString(),
    }),
  );
};

export const SaveCredentialsToStorage = (email, password) => {
  AsyncStorage.setItem(
    CREDENTIALS,
    JSON.stringify({
      email: email,
      password: password,
    }),
  );
};

export const ResetStorage = () => {
  AsyncStorage.removeItem(TOKEN);
  AsyncStorage.removeItem(CREDENTIALS);
};

export const ClearToken = () => {
  AsyncStorage.removeItem(TOKEN);
};

export const TOKEN = "mangi-bevi-token";
export const CREDENTIALS = "mangi-bevi-credentials";
