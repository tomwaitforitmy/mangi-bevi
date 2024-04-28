import {
  UserWantsNotificationForNewMeal,
  UserWantsNotificationForReaction,
} from "../../common_functions/UserWantsNotification.js";
import {
  enableNotifications,
  enableNotificationsForNewMeals,
  enableNotificationsForNewMealsForFriendsOnly,
  enableNotificationsForReactions,
} from "../../data/AvailableSettings.js";
import Setting from "../../models/Setting.js";
import User from "../../models/User.js";

describe("UserWantsNotificationForNewMeal", () => {
  it("returns true, if all settings are default state", () => {
    const u1 = User("u1", "Tommy");
    const u2 = User("u2", "Tom Test");

    const result = UserWantsNotificationForNewMeal(u1, u2);

    expect(result).toBeTruthy();
  });
  it("returns false, if notifications are disabled", () => {
    const u1 = User("u1", "Tommy");
    const u2 = User("u2", "Tom Test");
    u1.settings.push(new Setting(enableNotifications, false));

    const result = UserWantsNotificationForNewMeal(u1, u2);

    expect(result).toBeFalsy();
  });
  it("returns false, if notifications are disabled and others are explicitly enabled", () => {
    const u1 = User("u1", "Tommy");
    const u2 = User("u2", "Tom Test");
    u1.settings.push(new Setting(enableNotifications, false));
    u1.settings.push(new Setting(enableNotificationsForNewMeals, true));
    u1.settings.push(
      new Setting(enableNotificationsForNewMealsForFriendsOnly, true),
    );

    const result = UserWantsNotificationForNewMeal(u1, u2);

    expect(result).toBeFalsy();
  });
  it("returns false, if notifications are enabled and new meals are disabled", () => {
    const u1 = User("u1", "Tommy");
    const u2 = User("u2", "Tom Test");
    u1.settings.push(new Setting(enableNotifications, true));
    u1.settings.push(new Setting(enableNotificationsForNewMeals, false));

    const result = UserWantsNotificationForNewMeal(u1, u2);

    expect(result).toBeFalsy();
  });
  it("returns true, if notifications are enabled and new meals are enabled", () => {
    const u1 = User("u1", "Tommy");
    const u2 = User("u2", "Tom Test");
    u1.settings.push(new Setting(enableNotifications, true));
    u1.settings.push(new Setting(enableNotificationsForNewMeals, true));

    const result = UserWantsNotificationForNewMeal(u1, u2);

    expect(result).toBeTruthy();
  });
  it("returns true, if notifications for friends are enabled and user is a friend", () => {
    const u1 = User("u1", "Tommy");
    const u2 = User("u2", "Tom Test");
    u1.settings.push(
      new Setting(enableNotificationsForNewMealsForFriendsOnly, true),
    );
    u1.friends = ["u2", "u3", "u4"];

    const result = UserWantsNotificationForNewMeal(u1, u2);

    expect(result).toBeTruthy();
  });
  it("returns false, if notifications for friends are enabled and user is not friend", () => {
    const u1 = User("u1", "Tommy");
    const u2 = User("u2", "Tom Test");
    u1.settings.push(
      new Setting(enableNotificationsForNewMealsForFriendsOnly, true),
    );
    u1.friends = ["u3", "u4"];

    const result = UserWantsNotificationForNewMeal(u1, u2);

    expect(result).toBeFalsy();
  });
});

describe("UserWantsNotificationForReaction", () => {
  it("returns true, if all settings are default state", () => {
    const u1 = User("u1", "Tommy");

    const result = UserWantsNotificationForReaction(u1);

    expect(result).toBeTruthy();
  });
  it("returns false, if notifications are disabled", () => {
    const u1 = User("u1", "Tommy");
    u1.settings.push(new Setting(enableNotifications, false));

    const result = UserWantsNotificationForReaction(u1);

    expect(result).toBeFalsy();
  });
  it("returns false, if notifications for reactions are disabled", () => {
    const u1 = User("u1", "Tommy");
    u1.settings.push(new Setting(enableNotificationsForReactions, false));

    const result = UserWantsNotificationForReaction(u1);

    expect(result).toBeFalsy();
  });
});
