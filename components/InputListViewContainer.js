import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Keyboard,
  InteractionManager,
} from "react-native";
import MyListItem from "./MyListItem";
import Colors from "../constants/Colors";
import { Icon } from "react-native-elements";
import IconTypes from "../constants/IconTypes";

const InputListViewContainer = (props) => {
  const scrollViewRef = useRef(null);

  //This whole useEffect is just for the first time when the "edit" icon is pressed.
  //There, the keyboard appears, changing the layout.
  //During that animation scrollToEnd does not work correctly, because
  //the end coordinate is still changing.
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        //We cannot directly call scroll to end, because the height
        //of the content might not have changed, yet.
        InteractionManager.runAfterInteractions(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        });
      },
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  //Make sure to focus after the interaction is done
  const onPressIconInternal = (e) => {
    props.onPressIcon(e);
    scrollViewRef.current?.scrollToEnd({ animated: true });
    InteractionManager.runAfterInteractions(() => {
      props.inputRef?.current?.focus();
    });
  };

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
                onPressIcon={() => onPressIconInternal(e)}
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
          <View style={styles.sendIconContainer}>
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
    alignItems: "center", // Aligns input and send icon vertically
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
    marginVertical: 10, // Add some vertical margin for space between input and items
    fontSize: 20,
    borderRadius: 10,
    paddingHorizontal: 6, //to align text with rounded corners
  },
  sendIconContainer: {
    width: 40, // Set width and height to the same value for a circle
    height: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    borderRadius: 20,
    marginVertical: 10,
    marginLeft: 5,
  },
});

export default InputListViewContainer;
