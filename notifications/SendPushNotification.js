export async function sendPushNotification(
  expoPushToken,
  title,
  body,
  data,
  userToken,
) {
  if (!expoPushToken) {
    return;
  }
  if (expoPushToken === "no token") {
    return;
  }
  //you never want to send yourself a push notification
  if (expoPushToken === userToken) {
    console.warn("You never want to send yourself a push notification");
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
