import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import { Input } from "react-native-elements";
import { useDispatch } from "react-redux";
import LoadingIndicator from "../components/LoadingIndicator";
import Colors from "../constants/Colors";
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
    <LinearGradient
      colors={[Colors.second, Colors.primary]}
      style={styles.gradient}
    >
      <View style={styles.innerContainer}>
        <Input
          placeholderTextColor="white"
          placeholder="User"
          inputStyle={{ color: "white" }}
          inputContainerStyle={styles.inputContainerStyle}
        ></Input>
        <Input
          inputStyle={{ color: "white" }}
          placeholderTextColor="white"
          placeholder="Password"
          inputContainerStyle={styles.inputContainerStyle}
        ></Input>
        <Button title="Login" onPress={authHandler}></Button>
        <Button
          title="Creat new account"
          onPress={() => navigation.replace("SignUpScreen")}
        ></Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  inputContainerStyle: {
    borderBottomColor: "white",
  },
  innerContainer: {
    padding: 10,
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
