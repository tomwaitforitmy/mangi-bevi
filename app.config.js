//Take all other values from app.json
module.exports = ({ config }) => {
  const fullConfig = {
    ...config,
    android: {
      ...config.android,
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
    },
  };

  return {
    ...fullConfig,
  };
};
