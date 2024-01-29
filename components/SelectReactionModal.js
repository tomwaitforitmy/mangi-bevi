import React, { useState } from "react";
import { Modal, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import MyButton from "./MyButton";
import SelectReactionBox from "./SelectReactionBox";
import { useDispatch, useSelector } from "react-redux";
import * as mealsAction from "../store/actions/mealsAction";
import { AddOrUpdateReaction } from "../common_functions/AddOrUpdateReaction";
import Reaction from "../models/Reaction";
import LoadingIndicator from "./LoadingIndicator";

const SelectReactionModal = ({
  modalVisible,
  onRequestClose,
  preSelectedReaction,
  onReactionSelected,
  selectedMeal,
}) => {
  const [selectedReaction, setSelectedReaction] = useState(preSelectedReaction);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  const onReactionSelectedInternal = async (r) => {
    setSelectedReaction(r);
    setIsLoading(true);
    const newReaction = new Reaction(user.id, r);
    const newReactions = AddOrUpdateReaction(
      selectedMeal.reactions,
      newReaction,
    );
    selectedMeal.reactions = newReactions;
    await dispatch(mealsAction.editReactions(selectedMeal));
    setIsLoading(false);
    onReactionSelected();
  };

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={onRequestClose}>
      <SafeAreaView style={styles.safeAreaView}>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <View style={styles.modelView}>
            <Text style={styles.modalText}>Select your reaction</Text>
            <SelectReactionBox
              selectedReaction={selectedReaction}
              onReactionSelected={(r) => onReactionSelectedInternal(r)}
            />
            <MyButton onPress={onRequestClose}> {"Cancel"}</MyButton>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.screenBackGround,
    alignItems: "center",
  },
  modelView: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 22,
    padding: 4,
    backgroundColor: Colors.screenBackGround,
  },
  modalText: {
    fontSize: 24,
    marginBottom: 15,
    textAlign: "center",
  },
});

export default SelectReactionModal;
