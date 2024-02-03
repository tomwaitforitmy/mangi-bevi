import React from "react";
import { enableNotifications } from "../../data/AvailableSettings";
import BoolSettingSwitch from "./BoolSettingSwitch";

const NotificationsSwitch = () => {
  return (
    <BoolSettingSwitch
      descriptionText={"Enable push notifications"}
      settingName={enableNotifications}
    />
  );
};

export default NotificationsSwitch;
