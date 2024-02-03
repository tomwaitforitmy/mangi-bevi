import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MySwitch from "./MySwitch";
import { enableNotifications } from "../../data/AvailableSettings";
import * as usersAction from "../../store/actions/usersAction";
import Setting from "../../models/Setting";

const NotificationsSwitch = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  let initialSetting = true;
  const foundSetting = user.settings.find(
    (s) => s.name === enableNotifications,
  );

  if (foundSetting) {
    initialSetting = foundSetting.value;
  }

  //The state is needed. Without there is a delay in the switch value
  const [enableNotificationsState, setEnableNotificationsState] =
    useState(initialSetting);

  const onChangeValue = (v) => {
    setEnableNotificationsState((prev) => !prev);
    if (v) {
      user.settings = user.settings.filter(
        (s) => s.name !== enableNotifications,
      );
    } else {
      user.settings.push(new Setting(enableNotifications, false));
    }
    dispatch(usersAction.editSettings(user));
  };

  return (
    <MySwitch
      trueText={"Yes"}
      falseText={"No"}
      descriptionText={"Enable push notifications: "}
      onValueChange={(v) => onChangeValue(v)}
      value={enableNotificationsState}
      modeOnOff={true}
    />
  );
};

export default NotificationsSwitch;
