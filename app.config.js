module.exports = {
  android: {
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
  }, // All values in extra will be passed to your app.
  extra: {
    fact: "kittens are cool",
  },
};
