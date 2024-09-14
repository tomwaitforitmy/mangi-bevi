import React, { useRef, useState } from "react";
import { Text, StyleSheet, TextInput, Dimensions, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-native-elements";
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
  const scrollViewRef = useRef(null); // Ref to access the ScrollView

  const handleAddItem = () => {
    console.log(inputValue);

    if (inputValue.trim()) {
      if (items.includes(inputValue) || inputValue === "") {
        return;
      }
      setItems((prevItems) => [...prevItems, inputValue]); // Add the input value to the list
      setInputValue(""); // Clear the input field
      setTimeout(() => {
        inputRef.current?.focus(); // Refocus on the TextInput
      }, 100);
      // Scroll to bottom after adding a new item
      // setTimeout(() => {
      //   scrollViewRef.current?.scrollToEnd({ animated: true });
      // }, 200);
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
      ref={scrollViewRef} // Attach the ref to the ScrollView
      contentContainerStyle={styles.container}
      extraHeight={getExtraHeight()} // Adjust this value if necessary
      keyboardOpeningTime={0}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled">
      {items.map((i) => (
        // <Text style={styles.item} key={i}>
        //   {i}
        // </Text>
        <MyListItem
          key={i}
          title={i}
          IconName={"edit"}
          // onPressIcon={() => props.onPressIcon(e)}
        />
      ))}
      {/* <Button
        title="I cooked this!"
        onPress={async () => {
          // await cooked();
        }}
      />
      <Button title="Dummy" />
      <Button title="Dummy" />
      <Button title="Dummy" />
      <Button title="Dummy" />
      <Button title="Dummy" />
      <Button title="Dummy" />
      <Button
        title="Navigate to meal"
        onPress={async () => {
          // await navToMeal();
        }}
      />
      <Button
        title="Delete all test mangis"
        onPress={async () => {
          await deleteTestMangis(dispatch, allMeals, user);
        }}
      /> */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          multiline={true}
          ref={inputRef} // Attach the ref to the TextInput
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
    // alignContent: "center",
    minHeight: 50,
    maxHeight: 50,
    marginVertical: 10, // Add some vertical margin for spacing
  },
  inputContainer: {
    flexDirection: "row",
    // alignContent: "center",
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
    paddingBottom: 20, // Add padding to ensure the last item is fully visible    // alignItems: "center",
    // width: "100%",
  },
  input: {
    color: "white",
    backgroundColor: "lightgrey",
    width: "80%", // Use full width
    minHeight: 50,
    maxHeight: 50,
    marginVertical: 10, // Add some vertical margin for spacing
    fontSize: 20,
  },
  item: {
    flex: 1,
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "red",
  },
});

export default DevScreen;
