import moment from "moment";
import React from "react";
import { StyleSheet, Text } from "react-native";
import Colors from "../constants/Colors";

const AuthorBox = (props) => {
  const germanFormat = "D.M.YYYY, HH:mm";
  const creationDateString = moment(props.creationDate).format(germanFormat);
  const editDateString = moment(props.editDate).format(germanFormat);

  return (
    <Text style={{ ...styles.authorBox, ...props.style }}>
      Created by
      {/* the {" "}'s and  {"\n"} are needed here for nice formatting. The white spaces would be deleted by Prettier*/}
      <Text style={styles.authorHighlighted}> {props.authorName}</Text> on{" "}
      {creationDateString}
      {" Uhr"}
      {"\n"}
      {editDateString !== creationDateString ? (
        <Text>
          Last edited by
          <Text style={styles.authorHighlighted}>
            {" "}
            {props.editorName}
          </Text> on {editDateString}
          {" Uhr"}
        </Text>
      ) : (
        <Text />
      )}
    </Text>
  );
};

const styles = StyleSheet.create({
  authorBox: {
    textAlign: "left",
    fontSize: 12,
    paddingLeft: 12,
    paddingBottom: 10,
    paddingTop: 10,
  },
  authorHighlighted: {
    fontWeight: "bold",
    color: Colors.primary,
  },
});

export default AuthorBox;
