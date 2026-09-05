import moment from "moment";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";

const AuthorBox = (props) => {
  const theme = useAppTheme();
  const styles = getStyles(theme);
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

const getStyles = (theme) =>
  StyleSheet.create({
    authorBox: {
      textAlign: "left",
      fontSize: 12,
      paddingLeft: 12,
      paddingBottom: 10,
      paddingTop: 10,
    },
    authorHighlighted: {
      fontWeight: "bold",
      color: theme.colors.primary,
    },
  });

export default AuthorBox;
