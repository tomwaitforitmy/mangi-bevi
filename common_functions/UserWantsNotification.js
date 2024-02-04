import {
  enableNotifications,
  enableNotificationsForNewMeals,
  enableNotificationsForNewMealsForFriendsOnly,
  enableNotificationsForReactions,
} from "../data/AvailableSettings";

export const UserWantsNotificationForNewMeal = (receiver, sender) => {
  const foundNotifications = receiver.settings.find(
    (s) => s.name === enableNotifications,
  );
  if (foundNotifications && !foundNotifications.value) {
    return false;
  }
  const foundNotificationsForNewMeals = receiver.settings.find(
    (s) => s.name === enableNotificationsForNewMeals,
  );
  if (foundNotificationsForNewMeals && !foundNotificationsForNewMeals.value) {
    return false;
  }
  const foundNotificationsForNewMealsForFriendsOnly = receiver.settings.find(
    (s) => s.name === enableNotificationsForNewMealsForFriendsOnly,
  );
  if (foundNotificationsForNewMealsForFriendsOnly) {
    const foundFriend = receiver.friends.find((uid) => uid === sender.id);
    if (!foundFriend) {
      return false;
    }
  }
  return true;
};

export const UserWantsNotificationForReaction = (u) => {
  const foundNotifications = u.settings.find(
    (s) => s.name === enableNotifications,
  );
  if (foundNotifications && !foundNotifications.value) {
    return false;
  }
  const foundNotificationsForReactions = u.settings.find(
    (s) => s.name === enableNotificationsForReactions,
  );
  if (foundNotificationsForReactions && !foundNotificationsForReactions.value) {
    return false;
  }

  return true;
};
