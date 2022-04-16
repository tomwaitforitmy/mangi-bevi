import React from "react";
import { View, StyleSheet, TextInput, Button, ScrollView } from "react-native";
import { Input } from "react-native-elements";
import AnimatedTest from "../components/AnimatedTest";
import MyKeyboardAvoidingView from "../components/MyKeyboardAvoidingView";

function FavoritesScreen({ navigation }) {
  return <AnimatedTest></AnimatedTest>;
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    width: "100%",
  },
  container: {
    padding: 10,
  },
});

export default FavoritesScreen;
