const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";
const MY_IDENTIFIER = "com.tomwaitforitmy.mangibevi";
const MY_APP_NAME = "Mangi & Bevi";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return MY_IDENTIFIER + ".dev";
  }

  if (IS_PREVIEW) {
    return MY_IDENTIFIER + ".preview";
  }

  return MY_IDENTIFIER;
};

const getAppName = () => {
  if (IS_DEV) {
    return MY_APP_NAME + " (Dev)";
  }

  if (IS_PREVIEW) {
    return MY_APP_NAME + " (Prev)";
  }

  return MY_APP_NAME;
};

//Take all other values from app.json
export default ({ config }) => ({
  ...config,
  name: getAppName(),
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
  },
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
  },
  extra: {
    ...config.extra,
    firebaseApiKey:
      process.env.EXPO_BUILD_FIREBASE_API_KEY ?? //from expo build secrets
      process.env.EXPO_FIREBASE_API_KEY, //from my local .env file
    emailKey: process.env.EXPO_BUILD_EMAIL_KEY ?? process.env.EXPO_EMAIL_KEY,
    passKey:
      process.env.EXPO_BUILD_PASSWORD_KEY ?? process.env.EXPO_PASSWORD_KEY,
    appwriteProjectId:
      process.env.EXPO_BUILD_APPWRITE_PROJECT_ID ??
      process.env.EXPO_APPWRITE_PROJECT_ID,
    appwriteBucketId:
      process.env.EXPO_BUILD_APPWRITE_BUCKET_ID ??
      process.env.EXPO_APPWRITE_BUCKET_ID,
    supabaseAnonApiKey:
      process.env.EXPO_BUILD_SUPABASE_ANON_API_KEY ??
      process.env.EXPO_SUPABASE_ANON_API_KEY,
  },
});
