import React from "react";
import { enableNotifications } from "../../data/AvailableSettings";
import BoolSettingSwitch from "./BoolSettingSwitch";

const NotificationsSwitch = ({ onValueChanged }) => {
  return (
    <BoolSettingSwitch
      descriptionText={"Enable push notifications"}
      settingName={enableNotifications}
      onValueChanged={onValueChanged}
    />
  );
};

export default NotificationsSwitch;
