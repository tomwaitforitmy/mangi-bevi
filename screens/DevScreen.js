import React from "react";
import { StyleSheet, View } from "react-native";
import DragToSortCode from "../components/DragToSortCode";
import MovableElementContainer from "../components/MovableElementContainer";
import { PinchToZoom } from "../components/PinchToZoom";

function DevScreen({ navigation }) {
  return (
    // <View style={styles.container}>
    <MovableElementContainer></MovableElementContainer>
    // </View>
  );
  // return <AnimatedTest></AnimatedTest>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
});

export default DevScreen;
