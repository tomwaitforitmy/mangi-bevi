export async function sendPushNotification(expoPushToken, title, body, data) {
  if (!expoPushToken) {
    return;
  }
  if (expoPushToken === "no token") {
    return;
  }

  const message = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: body,
    data: data,
  };

  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate", //todo: hmmm?
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error("Cannot send push notification");
    console.error(error);
  }
}
