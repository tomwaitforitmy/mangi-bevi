import { UserWantsNotificationForNewMeal } from "../common_functions/UserWantsNotification";
import { DEV_MODE } from "../data/Environment";
import { sendPushNotification } from "./SendPushNotification";

export async function newMealCreated(users, mealTitle, mealId, author) {
  const data = {
    mealId: mealId,
    mealTitle: mealTitle,
    author: author,
  };

  const notificationTitle = "A new Mangi has been created!";
  const notificationText = mealTitle + " was created by " + author.name + ".";

  try {
    users.forEach((user) => {
      if (!user.expoPushToken) {
        return;
      }

      if (!user.expoPushToken.startsWith("ExponentPushToken[")) {
        return;
      }

      if (!UserWantsNotificationForNewMeal(user, author)) {
        console.log(user.name + " doesn't want the notification");
        return;
      }

      if (DEV_MODE) {
        console.log(
          "Sending to " +
            user.name +
            " Title: " +
            notificationTitle +
            " Text: " +
            notificationText,
        );
        return;
      }

      //Technically, we don't have to await here.
      //Not sure if this works.
      sendPushNotification(
        user.expoPushToken,
        notificationTitle,
        notificationText,
        data,
        author.expoPushToken,
      );
    });
  } catch (error) {
    console.error("Cannot not send all push notifications");
    console.error(error);
  }
}
