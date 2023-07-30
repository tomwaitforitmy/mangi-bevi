import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-elements";
import { useSelector } from "react-redux";
import MyButton from "../components/MyButton";

function ManageAccountScreen({ navigation }) {
  const user = useSelector((state) => state.users.user);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.bene}>
          <Text style={styles.bene}>Name: {user.name} </Text>
          <MyButton>{"edit"}</MyButton>
          <Divider />
          <Text style={styles.bene}>Email: {user.email}</Text>
          <MyButton>{"edit"}</MyButton>
          <Divider />
          <MyButton>{"Delete account"}</MyButton>
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
