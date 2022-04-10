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
  SET_CONFIRM_EMAIL_ERROR,
  SET_CONFIRM_PASSWORD_ERROR,
  SET_EMAIL_ERROR,
  SET_PASSWORD_ERROR,
} from "../store/formReducers/loginFormReducer";

function LoginScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  const initialState = {
    email: "",
    emailError: "",
    password: "",
    passwordError: "",
    confirmEmail: "",
    confirmEmailError: "",
    confirmPassword: "",
    confirmPasswordError: "",
    login: true,
  };

  const [formState, formDispatch] = useReducer(loginFormReducer, initialState);

  const dispatch = useDispatch();

  function isFormValid() {
    const validEmail =
      formState.email.includes("@") && formState.email.includes(".");
    if (!validEmail) {
      formDispatch({ type: SET_EMAIL_ERROR, error: "Invalid email." });
    }
    const validPassword = formState.password.length > 5;
    if (!validPassword) {
      formDispatch({
        type: SET_PASSWORD_ERROR,
        error: "Please use at least 6 characters.",
      });
    }

    if (formState.login) {
      return validEmail && validPassword;
    }

    const emailsAreEqual = formState.email === formState.confirmEmail;
    if (!emailsAreEqual) {
      formDispatch({
        type: SET_CONFIRM_EMAIL_ERROR,
        error: "Emails not equal.",
      });
    }
    const passwordsAreEqual = formState.password === formState.confirmPassword;
    if (!passwordsAreEqual) {
      formDispatch({
        type: SET_CONFIRM_PASSWORD_ERROR,
        error: "Passwords not equal.",
      });
    }

    return emailsAreEqual && passwordsAreEqual && validEmail && validPassword;
  }

  const authHandler = async () => {
    if (isFormValid()) {
      let action;
      if (formState.login) {
        action = authActions.login(formState.email, formState.password);
      } else {
        action = authActions.signup(formState.email, formState.password);
      }

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
          errorMessage={formState.emailError}
          errorStyle={{ color: "red" }}
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
            errorMessage={formState.confirmEmailError}
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
          errorMessage={formState.passwordError}
          secureTextEntry={true}
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
            errorMessage={formState.confirmPasswordError}
            secureTextEntry={true}
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
