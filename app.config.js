//Take all other values from app.json
module.exports = ({ config }) => {
  const fullConfig = {
    ...config,
    android: {
      ...config.android,
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
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
  };

  return {
    ...fullConfig,
  };
};
