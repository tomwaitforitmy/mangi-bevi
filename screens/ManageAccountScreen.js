import React, { useReducer } from "react";
import { ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import { Input } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import MyButton from "../components/MyButton";
import * as usersAction from "../store/actions/usersAction";
import * as authAction from "../store/actions/authAction";
import LoadingIndicator from "../components/LoadingIndicator";
import User from "../models/User";
import {
  INVALID_USER_ERROR,
  IsUserNameValid,
} from "../common_functions/IsUserNameValid";
import {
  INVALID_EMAIL_ERROR,
  IsEmailValid,
} from "../common_functions/IsEmailValid";
import loginFormReducer, {
  EDIT_FIELD,
  SET_FIELD_ERROR,
  LOADING,
  SUBMITTED,
} from "../store/formReducers/accountFormReducer";

function ManageAccountScreen({ navigation }) {
  const user = useSelector((state) => state.users.user);
  const users = useSelector((state) => state.users.users);
  const existingUserNames = users.map((u) => u.name);
  const existingUsersWithoutCurrent = existingUserNames.filter(
    (u) => u !== user.name,
  );

  const dispatch = useDispatch();

  const initialState = {
    email: user.email,
    emailError: "",
    user: user.name,
    userError: "",
    isLoading: false,
  };

  const userInput = React.createRef();
  const emailInput = React.createRef();

  const [formState, formDispatch] = useReducer(loginFormReducer, initialState);

  const isFormValid = () => {
    const userValid = IsUserNameValid(
      existingUsersWithoutCurrent,
      formState.user.trim(),
    );

    if (!userValid) {
      formDispatch({
        type: SET_FIELD_ERROR,
        field: "user",
        error: INVALID_USER_ERROR,
      });
      userInput.current.shake();
    }

    const emailValid = IsEmailValid(formState.email);

    if (!emailValid) {
      formDispatch({
        type: SET_FIELD_ERROR,
        field: "email",
        error: INVALID_EMAIL_ERROR,
      });
      emailInput.current.shake();
    }

    return userValid && emailValid;
  };

  const saveChanges = async () => {
    if (!isFormValid()) {
      return;
    }

    formDispatch({ type: LOADING });

    const updatedUser = User(
      user.id,
      formState.user.trim(),
      formState.email,
      user.meals,
      user.firebaseId,
    );

    await dispatch(usersAction.editUser(updatedUser));

    formDispatch({ type: SUBMITTED });

    navigation.goBack();
  };

  const fullDelete = async () => {
    //todo: delete mangis
    await softDelete();
  };

  const softDelete = async () => {
    formDispatch({ type: LOADING });
    await dispatch(usersAction.deleteUser(user));
    await dispatch(authAction.deleteAccount());
    await dispatch(authAction.logout());
    formDispatch({ type: SUBMITTED });
  };

  const deleteAccount = async () => {
    Alert.alert(
      "Delete Account forever?",
      "Are you sure you want to delete your account? Warning: this action cannot be undone!",
      [
        {
          text: "Yes",
          onPress: () => {
            console.log("first delete confirm");
            deleteData();
          },
        },
        {
          text: "No",
          style: "cancel",
        },
      ],
    );
  };

  const deleteData = async () => {
    Alert.alert(
      "Delete Mangis forever?",
      "Do you also want to delete your recipes?\nIf you press 'No', your recipes will be marked 'created anonymously' and kept. Only your account is deleted.\nIf you press 'Yes', all your recipes will be deleted and cannot be restored.\nIf you press 'Abort' nothing will be deleted.",
      [
        {
          text: "Yes",
          onPress: () => {
            console.log("full delete confirm");
            fullDelete();
          },
        },
        {
          text: "No",
          onPress: () => {
            softDelete();
            console.log("soft delete confirm");
          },
        },
        {
          text: "Abort",
          style: "cancel",
        },
      ],
    );
  };

  if (formState.isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.bene}>
          <Text style={styles.bene}>Name</Text>
          <Input
            placeholder="Name"
            onChangeText={(value) =>
              formDispatch({ type: EDIT_FIELD, value: value, field: "user" })
            }
            errorStyle={{ color: "red" }}
            errorMessage={formState.userError}
            value={formState.user}
            ref={userInput}
          />
          <Text style={styles.bene}>Email</Text>
          <Input
            placeholder="Email"
            onChangeText={(value) =>
              formDispatch({ type: EDIT_FIELD, value: value, field: "email" })
            }
            errorStyle={{ color: "red" }}
            errorMessage={formState.emailError}
            value={formState.email}
            ref={emailInput}
          />
          <MyButton onPress={() => saveChanges()}>{"Save"}</MyButton>
          <MyButton
            style={{ backgroundColor: "red" }}
            onPress={() => deleteAccount()}>
            {"Delete Account"}
          </MyButton>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
  },
  bene: {
    fontSize: 14,
    lineHeight: 30,
    margin: 5,
  },
  beneCenter: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 30,
  },
});

export default ManageAccountScreen;
