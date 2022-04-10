import { LinearGradient } from "expo-linear-gradient";
import React, { useReducer, useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import { Input } from "react-native-elements";
import { useDispatch } from "react-redux";
import LoadingIndicator from "../components/LoadingIndicator";
import Colors from "../constants/Colors";
import * as authActions from "../store/actions/authAction";
import loginFormReducer, {
  EDIT_CONFIRM_EMAIL,
  EDIT_CONFIRM_PASSWORD,
  EDIT_EMAIL,
  EDIT_PASSWORD,
} from "../store/formReducers/loginFormReducer";

function LoginScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  const initialState = {
    email: "",
    password: "",
    confirmEmail: "",
    confirmPassword: "",
    login: true,
  };

  const [formState, formDispatch] = useReducer(loginFormReducer, initialState);

  const dispatch = useDispatch();

  function isFormValid() {
    const validEmail =
      formState.email.includes("@") && formState.email.includes(".");
    if (!validEmail) {
      Alert.alert("Invalid email", "Please check your email.");
      return false;
    }
    const validPassword = formState.password.length > 5;
    if (!validPassword) {
      Alert.alert("Invalid password", "Please use at least 6 characters.");
      return false;
    }

    if (formState.login) {
      return validEmail && validPassword;
    }

    const emailsAreEqual = formState.email === formState.confirmEmail;
    if (!emailsAreEqual) {
      Alert.alert(
        "Invalid email(s).",
        "Your confirmed email is not equal to your email."
      );
    }
    const passwordsAreEqual = formState.password === formState.confirmPassword;
    if (!passwordsAreEqual) {
      Alert.alert(
        "Invalid password(s).",
        "Your confirmed password is not equal to your password."
      );
    }

    return emailsAreEqual && passwordsAreEqual && validEmail && validPassword;
  }

  const authHandler = async () => {
    if (isFormValid()) {
      let action = authActions.login(formState.email, formState.password);
      // let action = authActions.login("tommy@test.com", "123456");

      setIsLoading(true);
      try {
        await dispatch(action);
      } catch (err) {
        Alert.alert(
          "Could not login!",
          "Please check your input and your internet connection!"
        );
        console.log(err);
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  console.log("formState.email: " + formState.field);
  console.log(formState.password);

  return (
    <LinearGradient
      colors={[Colors.second, Colors.primary]}
      style={styles.gradient}
    >
      <View style={styles.innerContainer}>
        <Input
          placeholderTextColor="white"
          placeholder="Email"
          inputStyle={{ color: "white" }}
          inputContainerStyle={styles.inputContainerStyle}
          onChangeText={(value) =>
            formDispatch({ type: EDIT_EMAIL, value: value })
          }
        ></Input>
        {!formState.login && (
          <Input
            placeholderTextColor="white"
            placeholder="Confirm Email"
            inputStyle={{ color: "white" }}
            inputContainerStyle={styles.inputContainerStyle}
            onChangeText={(value) =>
              formDispatch({ type: EDIT_CONFIRM_EMAIL, value: value })
            }
          ></Input>
        )}
        <Input
          inputStyle={{ color: "white" }}
          placeholderTextColor="white"
          placeholder="Password"
          inputContainerStyle={styles.inputContainerStyle}
          onChangeText={(value) =>
            formDispatch({ type: EDIT_PASSWORD, value: value })
          }
        ></Input>
        {!formState.login && (
          <Input
            placeholderTextColor="white"
            placeholder="Confirm Password"
            inputStyle={{ color: "white" }}
            inputContainerStyle={styles.inputContainerStyle}
            onChangeText={(value) =>
              formDispatch({ type: EDIT_CONFIRM_PASSWORD, value: value })
            }
          ></Input>
        )}
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
