import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import { Input } from "react-native-elements";
import { useSelector } from "react-redux";
import MyButton from "../components/MyButton";

function ManageAccountScreen({ navigation }) {
  const user = useSelector((state) => state.users.user);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const saveChanges = () => {
    console.log(name);
    console.log(email);
  };

  const deleteAccount = () => {
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

  const deleteData = () => {
    Alert.alert(
      "Delete Mangis forever?",
      "Do you also want to delete your recipes?\nIf you press 'No', your recipes will be marked 'created anonymously' and kept. Only your account is deleted.\nIf you press 'Yes', all your recipes will be deleted and cannot be restored.\nIf you press 'Abort' nothing will be deleted.",
      [
        {
          text: "Yes",
          onPress: () => {
            console.log("full delete confirm");
          },
        },
        {
          text: "No",
          onPress: () => {
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

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.bene}>
          <Text style={styles.bene}>Name</Text>
          <Input
            placeholder="Name"
            onChangeText={(value) => setName(value)}
            value={name}
          />
          <Text style={styles.bene}>Email</Text>
          <Input
            placeholder="Email"
            onChangeText={(value) => setEmail(value)}
            value={email}
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
