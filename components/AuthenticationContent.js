import { LinearGradient } from "expo-linear-gradient";
import React, { useReducer } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Input } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import LoadingIndicator from "../components/LoadingIndicator";
import Colors from "../constants/Colors";
import * as authActions from "../store/actions/authAction";
import loginFormReducer, {
  EDIT_FIELD,
  SET_FIELD_ERROR,
  LOADING,
  SUBMITTED,
} from "../store/formReducers/accountFormReducer";
import MyButton from "./MyButton";
import MyKeyboardAvoidingView from "./MyKeyboardAvoidingView";
import {
  INVALID_EMAIL_ERROR,
  IsEmailValid,
} from "../common_functions/IsEmailValid";
import {
  INVALID_USER_ERROR,
  IsUserNameValid,
} from "../common_functions/IsUserNameValid";

function AuthenticationContent({ navigation, login, passwordReset }) {
  const initialState = {
    email: "",
    emailError: "",
    password: "",
    passwordError: "",
    confirmEmail: "",
    confirmEmailError: "",
    confirmPassword: "",
    confirmPasswordError: "",
    user: "",
    userError: "",
  };

  const [formState, formDispatch] = useReducer(loginFormReducer, initialState);

  const users = useSelector((state) => state.users.users);
  const existingUserNames = users.map((u) => u.name);

  const dispatch = useDispatch();
  const emailInput = React.createRef();
  const passwordInput = React.createRef();
  const userInput = React.createRef();

  function isFormValid() {
    const validEmail = IsEmailValid(formState.email);
    if (!validEmail) {
      formDispatch({
        type: SET_FIELD_ERROR,
        field: "email",
        error: INVALID_EMAIL_ERROR,
      });
      emailInput.current.shake();
    }
    if (passwordReset) {
      return validEmail;
    }

    const validPassword = formState.password.length > 5;
    if (!validPassword) {
      formDispatch({
        type: SET_FIELD_ERROR,
        field: "password",
        error: "Please use at least 6 characters.",
      });
      passwordInput.current.shake();
    }

    if (login) {
      return validEmail && validPassword;
    }

    const emailsAreEqual = formState.email === formState.confirmEmail;
    if (!emailsAreEqual) {
      formDispatch({
        type: SET_FIELD_ERROR,
        field: "confirmEmail",
        error: "Emails not equal.",
      });
    }
    const passwordsAreEqual = formState.password === formState.confirmPassword;
    if (!passwordsAreEqual) {
      formDispatch({
        type: SET_FIELD_ERROR,
        field: "confirmPassword",
        error: "Passwords not equal.",
      });
    }
    const validUser = IsUserNameValid(existingUserNames, formState.user.trim());
    if (!validUser) {
      formDispatch({
        type: SET_FIELD_ERROR,
        field: "user",
        error: INVALID_USER_ERROR,
      });
      userInput.current.shake();
    }

    return (
      emailsAreEqual &&
      passwordsAreEqual &&
      validUser &&
      validEmail &&
      validPassword
    );
  }

  const authHandler = async () => {
    if (!isFormValid()) {
      return;
    }

    let action;
    if (login) {
      action = authActions.login(formState.email, formState.password);
    }
    if (newAccount) {
      action = authActions.signup(
        formState.email,
        formState.password,
        formState.user.trim(),
      );
    }
    if (passwordReset) {
      action = authActions.resetPass(formState.email);
    }

    formDispatch({ type: LOADING });
    try {
      await dispatch(action);
    } catch (err) {
      Alert.alert(
        passwordReset
          ? "Could not reset your password!"
          : login
          ? "Could not login!"
          : "Could not create account!",
        "Please check your input and your internet connection!\n" + err,
      );
      console.log(err);
      formDispatch({ type: SUBMITTED });
    } finally {
      //successful password reset ends here
      formDispatch({ type: SUBMITTED });
      navigation.replace("LoginScreen");
    }
  };

  if (formState.isLoading) {
    return <LoadingIndicator />;
  }

  const newAccount = !login && !passwordReset;

  return (
    <MyKeyboardAvoidingView extraOffset={0}>
      <LinearGradient
        colors={[Colors.second, Colors.primary]}
        style={styles.gradient}>
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
            value={formState.email}
            ref={emailInput}
          />
          {newAccount && (
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
            />
          )}
          {!passwordReset && (
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
              value={formState.password}
              ref={passwordInput}
            />
          )}
          {newAccount && (
            <View>
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
              />
              <Input
                placeholderTextColor="white"
                placeholder="User Name"
                inputStyle={{ color: "white" }}
                inputContainerStyle={styles.inputContainerStyle}
                onChangeText={(value) =>
                  formDispatch({
                    type: EDIT_FIELD,
                    value: value,
                    field: "user",
                  })
                }
                errorMessage={formState.userError}
                ref={userInput}
              />
            </View>
          )}
          <MyButton onPress={authHandler}>
            {login ? "Login" : passwordReset ? "Reset password" : "Sign up"}
          </MyButton>
          {login && (
            <View>
              <MyButton
                style={styles.switchButton}
                onPress={() => navigation.replace("SignUpScreen")}>
                {"Create new account"}
              </MyButton>
              <MyButton
                style={styles.switchButton}
                onPress={() => navigation.replace("PasswordResetScreen")}>
                {"Forgot your password?"}
              </MyButton>
            </View>
          )}
          {(newAccount || passwordReset) && (
            <MyButton
              style={styles.switchButton}
              onPress={() => navigation.replace("LoginScreen")}>
              {"Back to login"}
            </MyButton>
          )}
        </View>
      </LinearGradient>
    </MyKeyboardAvoidingView>
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
