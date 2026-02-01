import React from "react";
import { ImageBackground, StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@react-native-vector-icons/feather";

const SwipeableImage = (props) => {
  return (
    <ImageBackground {...props} style={styles.image}>
      <View style={styles.iconMenuView}>
        {props.onTrashCallback && (
          <Pressable
            style={styles.iconButton}
            onPress={() => props.onTrashCallback(props.source.uri)}>
            <View style={styles.iconCircle}>
              <Feather name="trash" size={14} color="black" />
            </View>
          </Pressable>
        )}
        {props.onCheckCallback && (
          <Pressable
            style={styles.iconButton}
            onPress={() => props.onCheckCallback(props.source.uri)}>
            <View style={styles.iconCircle}>
              <Feather name="check-circle" size={14} color="black" />
            </View>
          </Pressable>
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
  iconButton: {
    marginRight: 10,
  },
  iconCircle: {
    backgroundColor: "#ccc",
    borderRadius: 12,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SwipeableImage;
