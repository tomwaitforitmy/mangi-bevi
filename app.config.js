//Take all other values from app.json
module.exports = ({ config }) => {
  const fullConfig = {
    ...config,
    android: {
      ...config.android,
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
    },
    mySecrets: {
      firebaseApiKey:
        process.env.EXPO_BUILD_FIREBASE_API_KEY ?? //from expo build secrets
        process.env.EXPO_PUBLIC_FIREBASE_API_KEY, //from my local .env file
      emailKey:
        process.env.EXPO_BUILD_EMAIL_KEY ?? process.env.EXPO_PUBLIC_EMAIL_KEY,
      passKey:
        process.env.EXPO_BUILD_PASSWORD_KEY ??
        process.env.EXPO_PUBLIC_PASSWORD_KEY,
    },
  };

  return {
    ...fullConfig,
  };
};
