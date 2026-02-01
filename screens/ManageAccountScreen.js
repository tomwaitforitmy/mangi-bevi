import React, { useReducer } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MyButton from "../components/MyButton";
import * as usersAction from "../store/actions/usersAction";
import * as authAction from "../store/actions/authAction";
import LoadingIndicator from "../components/LoadingIndicator";
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
import { ResetSecureStorage } from "../common_functions/CredentialStorage";
import Colors from "../constants/Colors";

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
    }

    const emailValid = IsEmailValid(formState.email);

    if (!emailValid) {
      formDispatch({
        type: SET_FIELD_ERROR,
        field: "email",
        error: INVALID_EMAIL_ERROR,
      });
    }

    return userValid && emailValid;
  };

  const saveChanges = async () => {
    if (!isFormValid()) {
      return;
    }

    formDispatch({ type: LOADING });

    const updatedUser = { ...user };
    updatedUser.name = formState.user.trim();
    updatedUser.email = formState.email;

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
    await authAction.deleteAccount();
    await ResetSecureStorage();
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
        <View>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, formState.userError && styles.inputError]}
            placeholder="Name"
            placeholderTextColor={Colors.textInputPlaceholderColor}
            onChangeText={(value) =>
              formDispatch({ type: EDIT_FIELD, value: value, field: "user" })
            }
            value={formState.user}
          />
          {formState.userError ? (
            <Text style={styles.errorText}>{formState.userError}</Text>
          ) : null}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, formState.emailError && styles.inputError]}
            placeholder="Email"
            placeholderTextColor={Colors.textInputPlaceholderColor}
            onChangeText={(value) =>
              formDispatch({ type: EDIT_FIELD, value: value, field: "email" })
            }
            value={formState.email}
          />
          {formState.emailError ? (
            <Text style={styles.errorText}>{formState.emailError}</Text>
          ) : null}
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
    margin: 5,
  },
  label: {
    fontSize: 16,
    lineHeight: 30,
  },
  input: {
    color: Colors.black,
    backgroundColor: Colors.white,
    width: "100%",
    minHeight: 40,
    fontSize: 20,
    borderRadius: 10,
    paddingHorizontal: 6, //to align text with rounded corners
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginHorizontal: 5,
    marginBottom: 5,
  },
});

export default ManageAccountScreen;
