import React, { useRef, useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  View,
  Button,
  ScrollView,
  Keyboard,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { deleteTestMangis } from "../firebase/deleteTestMangis";
import MyListItem from "../components/MyListItem";
import Colors from "../constants/Colors";

function DevScreen({ navigation }) {
  const allMeals = useSelector((state) => state.meals.meals);
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]); // State to store the list of inputs
  const inputRef = useRef(null); // Ref to access the TextInput
  const scrollViewRef = useRef(null); // Ref to access the ScrollView
  const [keyboardOffset, setKeyboardOffset] = useState(0); // To store keyboard offset

  useEffect(() => {
    const screenHeight = Dimensions.get("window").height;

    const getExtraHeight = () => {
      if (screenHeight >= 812) {
        return 94; // Adjust based on device height
      } else if (screenHeight >= 667 && screenHeight < 812) {
        return 60;
      } else {
        return 35;
      }
    };

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        const offset = event.endCoordinates.height - getExtraHeight();
        setKeyboardOffset(offset); // Set keyboard height
        //We cannot directly call scroll to end, because the height
        //of the content might not have changed, yet.
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 10);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardOffset(0); // Reset keyboard height
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleAddItem = () => {
    if (inputValue.trim()) {
      if (items.includes(inputValue) || inputValue === "") {
        return;
      }
      setItems((prevItems) => [...prevItems, inputValue]); // Add the input value to the list
      setInputValue(""); // Clear the input field
      inputRef.current?.focus(); // Refocus on the TextInput
    }
  };

  return (
    <View style={{ flex: 1, paddingBottom: keyboardOffset }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
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
            placeholder="Enter text"
            placeholderTextColor={"lightgrey"}
            selectionColor={"white"}
            value={inputValue}
            onChangeText={setInputValue}
            returnKeyType="default"
            blurOnSubmit={false} // Keeps the input focused after pressing return
            onEndEditing={() => {
              handleAddItem(); // Handles the action when return is pressed
            }}
          />
          <View style={styles.sendButtonContainer}>
            <Text style={styles.sendButtonText}>+</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center", // Aligns input and send button vertically
  },
  container: {
    flexGrow: 1,
  },
  input: {
    color: "white",
    backgroundColor: Colors.primary,
    width: "80%",
    minHeight: 60,
    maxHeight: 60,
    marginVertical: 10, // Add some vertical margin for spacing
    fontSize: 20,
    borderRadius: 10, // Rounded corners
    paddingHorizontal: 10, // Inner padding for text input
  },
  sendButtonContainer: {
    width: 40, // Set width and height to the same value for a perfect circle
    height: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    borderRadius: 20, // Half of the width/height for a circle
    marginVertical: 10,
    marginLeft: 5,
  },
  sendButtonText: {
    fontSize: 40, // Large "+"
    color: Colors.white,
    textAlign: "center", // Ensures centering
    textAlignVertical: "center", // For vertical centering on Android
    lineHeight: 42, // Match the button height to vertically center the +
  },
});

export default DevScreen;
