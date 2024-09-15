import React, { useRef, useState } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  View,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { deleteTestMangis } from "../firebase/deleteTestMangis";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MyListItem from "../components/MyListItem";

function DevScreen({ navigation }) {
  const allMeals = useSelector((state) => state.meals.meals);
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]); // State to store the list of inputs
  const inputRef = useRef(null); // Ref to access the TextInput

  const handleAddItem = () => {
    if (inputValue.trim()) {
      if (items.includes(inputValue) || inputValue === "") {
        return;
      }
      setItems((prevItems) => [...prevItems, inputValue]); // Add the input value to the list
      setInputValue(""); // Clear the input field
      setTimeout(() => {
        inputRef.current?.focus(); // Refocus on the TextInput
      }, 100);
    }
  };

  const screenHeight = Dimensions.get("window").height;

  // Dynamically calculate extraHeight based on screen height
  const getExtraHeight = () => {
    if (screenHeight >= 812) {
      return 95; // Adjust based on device height
    } else if (screenHeight >= 667 && screenHeight < 812) {
      return 65;
    } else {
      return 35;
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      extraHeight={getExtraHeight()} // Adjust this value if necessary
      keyboardOpeningTime={0}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled">
      <Button
        title="Delete all test mangis"
        onPress={async () => {
          await deleteTestMangis(dispatch, allMeals, user);
        }}
      />
      {items.map((i) => (
        <MyListItem key={i} title={i} IconName={"edit"} />
      ))}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          multiline={true}
          ref={inputRef}
          placeholder="Input"
          placeholderTextColor={"white"}
          value={inputValue}
          onChangeText={setInputValue}
          returnKeyType="default"
          blurOnSubmit={false} // Keeps the input focused after pressing return
          onEndEditing={() => {
            handleAddItem(); // Handles the action when return is pressed
          }}
        />
        <Text style={styles.text}>Send</Text>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    width: "15%",
    textAlign: "center",
    textAlignVertical: "bottom",
    backgroundColor: "red",
    minHeight: 60,
    maxHeight: 60,
    marginVertical: 10, // Add some vertical margin for spacing
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
  },
  input: {
    color: "white",
    backgroundColor: "lightgrey",
    width: "80%",
    minHeight: 60,
    maxHeight: 60,
    marginVertical: 10, // Add some vertical margin for spacing
    fontSize: 20,
  },
});

export default DevScreen;
