//Take all other values from app.json
module.exports = ({ config }) => {
  return {
    ...config,
    android: {
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
    },
    //Pass extra value to my app:
    extra: {
      fact: "kittens are cool",
    },
  };
};
