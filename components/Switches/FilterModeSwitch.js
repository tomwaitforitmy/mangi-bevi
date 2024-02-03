import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as tagActions from "../../store/actions/tagsAction";
import MySwitch from "./MySwitch";

const FilterModeSwitch = () => {
  const dispatch = useDispatch();
  const filterMode = useSelector((state) => state.tags.filterMode);
  const filterModeAndIsActive = filterMode === tagActions.FILTER_MODE_AND;

  const changeFilterModeHandler = () => {
    if (filterModeAndIsActive) {
      dispatch(tagActions.setFilterModeOr());
    } else {
      dispatch(tagActions.setFilterModeAnd());
    }
  };

  return (
    <MySwitch
      trueText={"And"}
      falseText={"Or"}
      descriptionText={"If more than one tag, combine with "}
      onValueChange={changeFilterModeHandler}
      value={filterModeAndIsActive}
      modeOnOff={false}
    />
  );
};

export default FilterModeSwitch;
