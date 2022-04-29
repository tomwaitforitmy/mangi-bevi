import React from "react";
import { StyleSheet, View } from "react-native";
import MovableElementContainer from "../components/MovableElementContainer";
import { PinchToZoom } from "../components/PinchToZoom";

function FavoritesScreen({ navigation }) {
  return (
    // <View style={styles.container}>
    <PinchToZoom></PinchToZoom>
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

export default FavoritesScreen;
