import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MySwitch from "./MySwitch";
import * as usersAction from "../../store/actions/usersAction";
import Setting from "../../models/Setting";

const BoolSettingSwitch = ({
  settingName,
  descriptionText,
  defaultValue = true,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  let initialSetting = defaultValue;
  const foundSetting = user.settings.find((s) => s.name === settingName);

  if (foundSetting) {
    initialSetting = foundSetting.value;
  }

  //The state is needed. Without there is a delay in the switch value
  const [settingState, setSettingState] = useState(initialSetting);

  const onChangeValue = (v) => {
    setSettingState((prev) => !prev);
    if (foundSetting) {
      user.settings = user.settings.filter((s) => s.name !== settingName);
    } else {
      user.settings.push(new Setting(settingName, v));
    }
    dispatch(usersAction.editSettings(user));
  };

  return (
    <MySwitch
      descriptionText={descriptionText}
      onValueChange={(v) => onChangeValue(v)}
      value={settingState}
      modeOnOff={true}
    />
  );
};

export default BoolSettingSwitch;
