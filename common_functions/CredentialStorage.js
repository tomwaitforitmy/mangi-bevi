import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as Application from "expo-application";
import Constants from "expo-constants";
import { Platform } from "react-native";

export const LoadCredentials = async () => {
  const credentials = await AsyncStorage.getItem(CREDENTIALS);

  if (!credentials) {
    return await LoadCredentialsSafely();
  } else {
    const transformedData = JSON.parse(credentials);
    const { email, password } = transformedData;
    await SaveCredentialsToStorage(email, password);
    await AsyncStorage.removeItem(CREDENTIALS);
    return { email, password };
  }
};

const LoadCredentialsSafely = async () => {
  const mailKey = await generateUserSpecificKey(
    Constants.expoConfig.mySecrets.emailKey,
  );
  const passKey = await generateUserSpecificKey(
    Constants.expoConfig.mySecrets.passKey,
  );

  const email = await SecureStore.getItemAsync(mailKey);
  const password = await SecureStore.getItemAsync(passKey);

  return { email, password };
};

export const SaveCredentialsToStorage = async (email, password) => {
  const mailKey = await generateUserSpecificKey(
    Constants.expoConfig.mySecrets.emailKey,
  );
  const passKey = await generateUserSpecificKey(
    Constants.expoConfig.mySecrets.passKey,
  );
  await SecureStore.setItemAsync(mailKey, email);
  await SecureStore.setItemAsync(passKey, password);
};

const generateUserSpecificKey = async (key) => {
  try {
    let uniqueId;

    if (Platform.OS === "android") {
      uniqueId = Application.androidId;
    } else if (Platform.OS === "ios") {
      uniqueId = await Application.getIosIdForVendorAsync();
    }

    const combinedString = `${key}-${uniqueId}`;
    return combinedString;
  } catch (error) {
    console.error("Error getting user specific key:", error);
  }
};

export const ResetSecureStorage = async () => {
  const mailKey = await generateUserSpecificKey(
    Constants.expoConfig.mySecrets.emailKey,
  );
  const passKey = await generateUserSpecificKey(
    Constants.expoConfig.mySecrets.passKey,
  );

  await SecureStore.deleteItemAsync(mailKey);
  await SecureStore.deleteItemAsync(passKey);
};

export const ResetStorage = async () => {
  await AsyncStorage.removeItem(CREDENTIALS);
};

export const CREDENTIALS = "mangi-bevi-credentials";
