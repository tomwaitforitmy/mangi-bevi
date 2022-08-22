import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from "react-native";

// See https://stackoverflow.com/questions/55311228/how-to-remove-warning-async-storage-has-been-extracted-from-react-native-core
LogBox.ignoreLogs([
  `AsyncStorage has been extracted from react-native core and will be removed in a future release`,
]);

export const LoadToken = async () => {
  const tokenData = await AsyncStorage.getItem(TOKEN);
  if (!tokenData) {
    return;
  }

  const transformedData = JSON.parse(tokenData);
  const { token, userId, expericationDate } = transformedData;
  const expericationDateTransformed = new Date(expericationDate);

  if (expericationDateTransformed <= new Date() || !token || !userId) {
    return;
  }

  const experiationTime =
    expericationDateTransformed.getTime() - new Date().getTime();

  return { token, userId, experiationTime };
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

export const SaveTokenDataToStorage = (token, userId, expericationDate) => {
  AsyncStorage.setItem(
    TOKEN,
    JSON.stringify({
      token: token,
      userId: userId,
      expericationDate: expericationDate.toISOString(),
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
