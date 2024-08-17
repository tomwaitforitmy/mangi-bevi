import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MySwitch from "./MySwitch";
import * as usersAction from "../../store/actions/usersAction";
import Setting from "../../models/Setting";
import { enableAndFilter } from "../../data/AvailableSettings";

const AndOrTagFilterSwitch = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  let initialSetting = false;
  const foundSetting = user.settings.find((s) => s.name === enableAndFilter);

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
      editedUser.settings = user.settings.filter(
        (s) => s.name !== enableAndFilter,
      );
    } else {
      editedUser.settings.push(Setting(enableAndFilter, v));
    }
    dispatch(usersAction.editSettings(editedUser));
  };

  return (
    <MySwitch
      falseText={"Or"}
      trueText={"And"}
      descriptionText={"If more than one tag, combine with "}
      onValueChange={(v) => onChangeValue(v)}
      value={settingState}
      modeOnOff={false}
    />
  );
};

export default AndOrTagFilterSwitch;
