import React from "react";
import { enableNotificationsForNewMeals } from "../../data/AvailableSettings";
import BoolSettingSwitch from "./BoolSettingSwitch";

const NotificationsForNewMealsSwitch = () => {
  return (
    <BoolSettingSwitch
      descriptionText={"Notifications for new Mangis"}
      settingName={enableNotificationsForNewMeals}
    />
  );
};

export default NotificationsForNewMealsSwitch;
