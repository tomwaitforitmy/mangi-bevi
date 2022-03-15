import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Text,
  ScrollView,
  FlatList,
} from "react-native";
import { Input } from "react-native-elements";
import MyKeyboardAvoidingView from "../components/MyKeyboardAvoidingView";

function FavoritesScreen({ navigation }) {
  const [data, setData] = useState([
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
    {
      id: 6,
    },
    {
      id: 7,
    },
    {
      id: 8,
    },
    {
      id: 9,
    },
    {
      id: 10,
    },
    {
      id: 11,
    },
    {
      id: 12,
    },
    {
      id: 13,
    },
    {
      id: 14,
    },
    {
      id: 15,
    },
  ]);

  return (
    <MyKeyboardAvoidingView>
      {/* <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ flex: 1, paddingVertical: 20 }}>{item.id}</Text>
        )}
      /> */}
      <ScrollView style={styles.scrollViewContainer}>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
        <Button title="blocker"></Button>
      </ScrollView>
      {/* <View style={styles.container}> */}
      {/* <Input renderErrorMessage={true} placeholder="enter text"></Input> */}
      {/* <TextInput placeholder="enter text"></TextInput> */}
      <View style={{ flex: 1, marginBottom: 40 }}>
        <TextInput
          style={{
            backgroundColor: "#2E2E2E",
            width: "100%",
            borderRadius: 18,
            height: 36,
            paddingLeft: 10,
            paddingRight: 10,
            color: "#FFFFFF",
          }}
        />
      </View>
    </MyKeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    width: "100%",
  },
  container: {
    flex: 1,
    // padding: 10,
    // minHeight: 50,
  },
});

export default FavoritesScreen;
