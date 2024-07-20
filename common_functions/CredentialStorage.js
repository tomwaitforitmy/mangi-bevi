import AsyncStorage from "@react-native-async-storage/async-storage";

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

export const SaveCredentialsToStorage = (email, password) => {
  AsyncStorage.setItem(
    CREDENTIALS,
    JSON.stringify({
      email: email,
      password: password,
    }),
  );
};

export const ResetStorage = async () => {
  await AsyncStorage.removeItem(CREDENTIALS);
};

export const CREDENTIALS = "mangi-bevi-credentials";
