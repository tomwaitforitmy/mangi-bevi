import React from "react";
import { View, StyleSheet, TextInput, Button, ScrollView } from "react-native";
import { Input } from "react-native-elements";
import MyKeyboardAvoidingView from "../components/MyKeyboardAvoidingView";

function FavoritesScreen({ navigation }) {
  return (
    <MyKeyboardAvoidingView>
      <ScrollView style={styles.scrollViewContainer}>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
      </ScrollView>
      <View style={styles.container}>
        <Input placeholder="enter text"></Input>
        <TextInput placeholder="enter text"></TextInput>
      </View>
    </MyKeyboardAvoidingView>
  );
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
