import React from "react";
import MyListItem from "../../components/MyListItem";

function Element({ title }) {
  return <MyListItem title={title} IconName={"edit"}></MyListItem>;
}

export default Element;
