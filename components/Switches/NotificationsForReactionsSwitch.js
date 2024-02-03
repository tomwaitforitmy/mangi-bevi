import React from "react";
import { enableNotificationsForReactions } from "../../data/AvailableSettings";
import BoolSettingSwitch from "./BoolSettingSwitch";

const NotificationsForReactionsSwitch = () => {
  return (
    <BoolSettingSwitch
      trueText={"Yes"}
      falseText={"No"}
      descriptionText={"Notifications for reactions: "}
      settingName={enableNotificationsForReactions}
    />
  );
};

export default NotificationsForReactionsSwitch;
