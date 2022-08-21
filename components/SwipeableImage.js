import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import IconTypes from "../constants/IconTypes";

const SwipeableImage = (props) => {
  return (
    <ImageBackground {...props} style={styles.image}>
      <View style={styles.iconMenuView}>
        {props.onTrashCallback && (
          <Icon
            color="#ccc"
            reverse
            reverseColor="black"
            size={14}
            type={IconTypes.feather}
            name="trash"
            onPress={() => props.onTrashCallback(props.source.uri)}
          />
        )}
        {props.onCheckCallback && (
          <Icon
            color="#ccc"
            reverse
            reverseColor="black"
            size={14}
            type={IconTypes.feather}
            name="check-circle"
            onPress={() => props.onCheckCallback(props.source.uri)}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  iconMenuView: {
    width: "100%", //this is because icon "overflow" to right
    height: "100%",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-evenly",
  },
});

export default SwipeableImage;
