import React from "react";
import MyListItem from "./MyListItem";

export const ELEMENT_HEIGHT = 60;

function Element({ title }) {
  return <MyListItem title={title} IconName={"edit"}></MyListItem>;
}

export default Element;
