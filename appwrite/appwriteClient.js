import { Client, Storage, Account } from "react-native-appwrite";
import Constants from "expo-constants";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(Constants.expoConfig.extra.appwriteProjectId);

export const account = new Account(client);

export const storage = new Storage(client);
