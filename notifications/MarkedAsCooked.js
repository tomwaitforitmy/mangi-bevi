import {
  GetAuthorByMealId,
  GetAuthorName,
} from "../common_functions/GetAuthorName";
import { UserWantsNotificationForReaction } from "../common_functions/UserWantsNotification";
import { DEV_MODE } from "../data/Environment";
import { sendPushNotification } from "./SendPushNotification";

export async function markedAsCooked(mealTitle, mealId, cook, users) {
  const data = {
    mealId: mealId,
    mealTitle: mealTitle,
  };

  const cookName = GetAuthorName(cook.id, users);
  const mealAuthor = GetAuthorByMealId(mealId, users);

  if (mealAuthor.id === cook.id) {
    //You never want to send to yourself
    return;
  }

  const notificationTitle = "Someone cooked your mangi!";
  const notificationText = cookName + " says thanks for sharing " + mealTitle;

  try {
    if (!mealAuthor.expoPushToken) {
      return;
    }

    if (!mealAuthor.expoPushToken.startsWith("ExponentPushToken[")) {
      return;
    }

    if (!UserWantsNotificationForReaction(mealAuthor)) {
      console.log(mealAuthor.name + " doesn't want the notification");
      return;
    }

    if (DEV_MODE) {
      console.log(
        "Sending to " +
          mealAuthor.name +
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
      mealAuthor.expoPushToken,
      notificationTitle,
      notificationText,
      data,
      cook.expoPushToken,
    );
  } catch (error) {
    console.error("Cannot not send push notification to " + mealAuthor.name);
    console.error(error);
  }
}
