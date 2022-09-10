import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import LayoutAnimations from "../experiments/LayoutAnimations";

function DevScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <LayoutAnimations />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DevScreen;
