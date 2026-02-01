import { LinearGradient } from "expo-linear-gradient";
import React, { useReducer } from "react";
import { View, StyleSheet, Alert, TextInput, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LoadingIndicator from "../components/LoadingIndicator";
import Colors from "../constants/Colors";
import * as authActions from "../store/actions/authAction";
import * as userActions from "../store/actions/usersAction";
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
import {
  ResetSecureStorage,
  SaveCredentialsToStorage,
} from "../common_functions/CredentialStorage";

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

  function isFormValid() {
    const validEmail = IsEmailValid(formState.email);
    if (!validEmail) {
      formDispatch({
        type: SET_FIELD_ERROR,
        field: "email",
        error: INVALID_EMAIL_ERROR,
      });
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

    formDispatch({ type: LOADING });
    try {
      if (login) {
        await authActions.login(formState.email, formState.password);
        SaveCredentialsToStorage(formState.email, formState.password);
      }
      if (newAccount) {
        await dispatch(
          userActions.signUpAndCreateUser(
            formState.email,
            formState.password,
            formState.user.trim(),
          ),
        );
        SaveCredentialsToStorage(formState.email, formState.password);
      }
      if (passwordReset) {
        await authActions.resetPass(formState.email);
        await ResetSecureStorage();
      }
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
          <TextInput
            placeholderTextColor="white"
            placeholder="Email"
            style={[styles.input, formState.emailError && styles.inputError]}
            onChangeText={(value) =>
              formDispatch({ type: EDIT_FIELD, value: value, field: "email" })
            }
            value={formState.email}
          />
          {formState.emailError ? (
            <Text style={styles.errorText}>{formState.emailError}</Text>
          ) : null}
          {newAccount && (
            <>
              <TextInput
                placeholderTextColor="white"
                placeholder="Confirm Email"
                style={[
                  styles.input,
                  formState.confirmEmailError && styles.inputError,
                ]}
                onChangeText={(value) =>
                  formDispatch({
                    type: EDIT_FIELD,
                    value: value,
                    field: "confirmEmail",
                  })
                }
                value={formState.confirmEmail}
              />
              {formState.confirmEmailError ? (
                <Text style={styles.errorText}>
                  {formState.confirmEmailError}
                </Text>
              ) : null}
            </>
          )}
          {!passwordReset && (
            <>
              <TextInput
                placeholderTextColor="white"
                placeholder="Password"
                style={[
                  styles.input,
                  formState.passwordError && styles.inputError,
                ]}
                onChangeText={(value) =>
                  formDispatch({
                    type: EDIT_FIELD,
                    value: value,
                    field: "password",
                  })
                }
                secureTextEntry={true}
                value={formState.password}
              />
              {formState.passwordError ? (
                <Text style={styles.errorText}>{formState.passwordError}</Text>
              ) : null}
            </>
          )}
          {newAccount && (
            <>
              <TextInput
                placeholderTextColor="white"
                placeholder="Confirm Password"
                style={[
                  styles.input,
                  formState.confirmPasswordError && styles.inputError,
                ]}
                onChangeText={(value) =>
                  formDispatch({
                    type: EDIT_FIELD,
                    value: value,
                    field: "confirmPassword",
                  })
                }
                secureTextEntry={true}
                value={formState.confirmPassword}
              />
              {formState.confirmPasswordError ? (
                <Text style={styles.errorText}>
                  {formState.confirmPasswordError}
                </Text>
              ) : null}
              <TextInput
                placeholderTextColor="white"
                placeholder="User Name"
                style={[styles.input, formState.userError && styles.inputError]}
                onChangeText={(value) =>
                  formDispatch({
                    type: EDIT_FIELD,
                    value: value,
                    field: "user",
                  })
                }
                value={formState.user}
              />
              {formState.userError ? (
                <Text style={styles.errorText}>{formState.userError}</Text>
              ) : null}
            </>
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
  input: {
    color: "white",
    borderBottomColor: "white",
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 4,
    fontSize: 16,
  },
  inputError: {
    borderBottomColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginHorizontal: 4,
    marginBottom: 10,
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
