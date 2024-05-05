import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MySwitch from "./MySwitch";
import * as usersAction from "../../store/actions/usersAction";
import Setting from "../../models/Setting";

const BoolSettingSwitch = ({
  settingName,
  descriptionText,
  onValueChanged,
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
    //Create a deep copy to avoid state corruption
    const editedUser = { ...user };
    editedUser.settings = user.settings.map((s) => ({ ...s }));
    if (foundSetting) {
      editedUser.settings = user.settings.filter((s) => s.name !== settingName);
    } else {
      editedUser.settings.push(Setting(settingName, v));
    }
    dispatch(usersAction.editSettings(editedUser));
    if (onValueChanged) {
      onValueChanged(v);
    }
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
