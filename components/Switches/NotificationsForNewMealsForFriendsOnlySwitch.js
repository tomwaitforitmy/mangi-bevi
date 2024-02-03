import React from "react";
import { enableNotificationsForNewMealsForFriendsOnly } from "../../data/AvailableSettings";
import BoolSettingSwitch from "./BoolSettingSwitch";

const NotificationsForNewMealsForFriendsOnlySwitch = () => {
  return (
    <BoolSettingSwitch
      descriptionText={"Notifications for new Mangis of friends only"}
      settingName={enableNotificationsForNewMealsForFriendsOnly}
    />
  );
};

export default NotificationsForNewMealsForFriendsOnlySwitch;
