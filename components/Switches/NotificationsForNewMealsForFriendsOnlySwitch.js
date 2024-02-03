import React from "react";
import { enableNotificationsForNewMealsForFriendsOnly } from "../../data/AvailableSettings";
import BoolSettingSwitch from "./BoolSettingSwitch";

const NotificationsForNewMealsForFriendsOnlySwitch = () => {
  return (
    <BoolSettingSwitch
      trueText={"Yes"}
      falseText={"No"}
      descriptionText={"Notifications for new Mangis of friends only: "}
      settingName={enableNotificationsForNewMealsForFriendsOnly}
    />
  );
};

export default NotificationsForNewMealsForFriendsOnlySwitch;
