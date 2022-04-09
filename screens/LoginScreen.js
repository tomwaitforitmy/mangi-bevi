import React, { useState } from "react";
import { View, StyleSheet, TextInput, Button, ScrollView } from "react-native";
import { Input } from "react-native-elements";
import { useDispatch } from "react-redux";
import LoadingIndicator from "../components/LoadingIndicator";
import * as authActions from "../store/actions/authAction";

function LoginScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const authHandler = async () => {
    let action = authActions.login("tommy@test.com", "123456");

    setIsLoading(true);
    try {
      await dispatch(action);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <Input placeholder="User"></Input>
      <Input placeholder="Password"></Input>
      <Button title="Login" onPress={authHandler}></Button>
      <Button
        title="Creat new account"
        onPress={() => navigation.replace("SignUpScreen")}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default LoginScreen;
