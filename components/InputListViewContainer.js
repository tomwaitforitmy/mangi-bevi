import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Keyboard,
} from "react-native";
import MyListItem from "./MyListItem";
import Colors from "../constants/Colors";
import { Icon } from "react-native-elements";
import IconTypes from "../constants/IconTypes";

const InputListViewContainer = (props) => {
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        //We cannot directly call scroll to end, because the height
        //of the content might not have changed, yet.
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 10);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={{ ...styles.container, ...props.style }}>
      <ScrollView
        style={styles.scrollList}
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <TouchableOpacity onLongPress={props.onLongPress}>
          {props.data &&
            props.data.map((e) => (
              <MyListItem
                key={e}
                title={e}
                IconName={"edit"}
                onPressIcon={() => props.onPressIcon(e)}
              />
            ))}
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            multiline={true}
            ref={props.inputRef}
            placeholder="Enter text"
            placeholderTextColor={Colors.textInputPlaceholderColor}
            selectionColor={Colors.white}
            onChangeText={(value) => props.onChangeText(value)}
            returnKeyType="default"
            blurOnSubmit={false} // Keeps the input focused after pressing return
            onEndEditing={() => {
              props.onBlur(); // Handles the action when return is pressed
            }}
          />
          <View style={styles.sendButtonContainer}>
            <Icon
              name={"arrowup"}
              type={IconTypes.antdesign}
              color={Colors.white}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

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
    color: Colors.white,
    backgroundColor: Colors.textInputBackground,
    width: "85%",
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
    borderRadius: 20,
    marginVertical: 10,
    marginLeft: 5,
  },
});

export default InputListViewContainer;
