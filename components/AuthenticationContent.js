import { LinearGradient } from "expo-linear-gradient";
import React, { useReducer, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Input } from "react-native-elements";
import { useDispatch } from "react-redux";
import LoadingIndicator from "../components/LoadingIndicator";
import Colors from "../constants/Colors";
import * as authActions from "../store/actions/authAction";
import loginFormReducer, {
  EDIT_FIELD,
  SET_CONFIRM_EMAIL_ERROR,
  SET_CONFIRM_PASSWORD_ERROR,
  SET_EMAIL_ERROR,
  SET_PASSWORD_ERROR,
} from "../store/formReducers/loginFormReducer";
import MyButton from "./MyButton";
import MyKeyboardAvoidingViewOnScreenWithoutMaterial from "./MyKeyboardAvoidingViewOnScreenWithoutMaterial";

function AuthenticationContent({ navigation, login }) {
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

    if (login) {
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

  // const emailInput = React.createRef();
  // const confirmEmailInput = React.createRef();
  // const passwordInput = React.createRef();
  // const confirmPasswordInput = React.createRef();

  const authHandler = async () => {
    if (isFormValid()) {
      let action;
      if (login) {
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
        // emailInput.current.setNativeProps({ value: formState.email });
        // confirmEmailInput.current.setNativeProps({ value: "hello" });
        // passwordInput.current.setNativeProps({ value: formState.password });
        // confirmPasswordInput.current.setNativeProps({ value: "hello" });
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <MyKeyboardAvoidingViewOnScreenWithoutMaterial>
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
              formDispatch({ type: EDIT_FIELD, value: value, field: "email" })
            }
            errorMessage={formState.emailError}
            errorStyle={{ color: "red" }}
          ></Input>
          {!login && (
            <Input
              placeholderTextColor="white"
              placeholder="Confirm Email"
              inputStyle={{ color: "white" }}
              inputContainerStyle={styles.inputContainerStyle}
              onChangeText={(value) =>
                formDispatch({
                  type: EDIT_FIELD,
                  value: value,
                  field: "confirmEmail",
                })
              }
              errorMessage={formState.confirmEmailError}
              // ref={confirmEmailInput}
            ></Input>
          )}
          <Input
            inputStyle={{ color: "white" }}
            placeholderTextColor="white"
            placeholder="Password"
            inputContainerStyle={styles.inputContainerStyle}
            onChangeText={(value) =>
              formDispatch({
                type: EDIT_FIELD,
                value: value,
                field: "password",
              })
            }
            errorMessage={formState.passwordError}
            secureTextEntry={true}
            // ref={passwordInput}
          ></Input>
          {!login && (
            <Input
              placeholderTextColor="white"
              placeholder="Confirm Password"
              inputStyle={{ color: "white" }}
              inputContainerStyle={styles.inputContainerStyle}
              onChangeText={(value) =>
                formDispatch({
                  type: EDIT_FIELD,
                  value: value,
                  field: "confirmPassword",
                })
              }
              errorMessage={formState.confirmPasswordError}
              secureTextEntry={true}
              // ref={confirmPasswordInput}
            ></Input>
          )}
          <MyButton onPress={authHandler}>
            {login ? "Login" : "Sign up"}
          </MyButton>
          {login && (
            <MyButton
              style={styles.switchButton}
              onPress={() => navigation.replace("SignUpScreen")}
            >
              {"Creat new account"}
            </MyButton>
          )}
          {!login && (
            <MyButton
              style={styles.switchButton}
              onPress={() => navigation.replace("LoginScreen")}
            >
              {"Login existing account"}
            </MyButton>
          )}
        </View>
      </LinearGradient>
    </MyKeyboardAvoidingViewOnScreenWithoutMaterial>
  );
}

const styles = StyleSheet.create({
  inputContainerStyle: {
    borderBottomColor: "white",
  },
  switchButton: {
    marginTop: 5,
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

export default AuthenticationContent;
