import React from "react";
import { View, StyleSheet, TextInput, Button, ScrollView } from "react-native";
import { Input } from "react-native-elements";

function SignUpScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Input placeholder="User"></Input>
      <Input placeholder="Password"></Input>
      <Button title="Register"></Button>
      <Button
        onPress={() => navigation.replace("LoginScreen")}
        title="Login existing account"
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default SignUpScreen;
