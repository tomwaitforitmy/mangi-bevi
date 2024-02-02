import {
  GetAuthorByMealId,
  GetAuthorName,
} from "../common_functions/GetAuthorName";
import { DEV_MODE } from "../data/Environment";
import { sendPushNotification } from "./SendPushNotification";

export async function reactionGiven(
  reaction,
  mealTitle,
  mealId,
  reactionGiver,
  users,
) {
  //don't send any notification in case of removal
  if (reaction.emoji === "") {
    return;
  }

  const data = {
    mealId: mealId,
    mealTitle: mealTitle,
    emoji: reaction.emoji,
  };

  const reactionGiverName = GetAuthorName(reactionGiver.id, users);
  const mealAuthor = GetAuthorByMealId(mealId, users);

  if (mealAuthor.id === reaction.authorId) {
    //You never want to send to yourself
    return;
  }

  const notificationTitle = "Someone likes your mangi!";
  const notificationText =
    reactionGiverName + " reacted with " + reaction.emoji + " on " + mealTitle;

  try {
    if (!mealAuthor.expoPushToken) {
      return;
    }

    if (!mealAuthor.expoPushToken.startsWith("ExponentPushToken[")) {
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
      reactionGiver.expoPushToken,
    );
  } catch (error) {
    console.error("Cannot not send push notification to " + mealAuthor.name);
    console.error(error);
  }
}
