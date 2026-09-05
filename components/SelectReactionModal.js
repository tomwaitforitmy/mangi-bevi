import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../theme/useAppTheme";
import MyButton from "./MyButton";
import SelectReactionBox from "./SelectReactionBox";
import { useDispatch, useSelector } from "react-redux";
import * as mealsAction from "../store/actions/mealsAction";
import { AddOrUpdateReaction } from "../common_functions/AddOrUpdateReaction";
import Reaction from "../models/Reaction";
import LoadingIndicator from "./LoadingIndicator";
import { reactionGiven } from "../notifications/ReactionGiven";

const SelectReactionModal = ({
  modalVisible,
  onRequestClose,
  onReactionSelected,
  selectedMeal,
}) => {
  const theme = useAppTheme();
  const styles = getStyles(theme);
  const user = useSelector((state) => state.users.user);
  const users = useSelector((state) => state.users.users);
  const userHasReactedBefore = selectedMeal.reactions.find(
    (r) => r.authorId === user.id,
  );

  const preSelectedReaction = userHasReactedBefore
    ? userHasReactedBefore.emoji
    : "";

  const [selectedReaction, setSelectedReaction] = useState(preSelectedReaction);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const onReactionSelectedInternal = async (r) => {
    if (preSelectedReaction === r) {
      //nothing todo
      onReactionSelected();
      return;
    }
    setSelectedReaction(r);
    setIsLoading(true);

    const newReaction = Reaction(user.id, r);
    const newReactions = AddOrUpdateReaction(
      selectedMeal.reactions,
      newReaction,
    );

    //create a copy to avoid state corruption
    const editedMeal = { ...selectedMeal };
    editedMeal.reactions = newReactions;

    await dispatch(mealsAction.editReactions(editedMeal, user.id, newReaction));
    await reactionGiven(
      newReaction,
      editedMeal.title,
      editedMeal.id,
      user,
      users,
    );

    setIsLoading(false);
    onReactionSelected();
  };

  const onRequestCloseInternal = async (r) => {
    if (!userHasReactedBefore) {
      //return if there was no reaction given
      onReactionSelected();
      return;
    }

    onReactionSelectedInternal("");
  };

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={onRequestCloseInternal}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeAreaView}>
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <TouchableWithoutFeedback onPress={onRequestCloseInternal}>
              <View style={styles.modelView}>
                <Text style={styles.modalText}>Select your reaction</Text>
                <SelectReactionBox
                  selectedReaction={selectedReaction}
                  onReactionSelected={(r) => onReactionSelectedInternal(r)}
                />
                <MyButton onPress={onRequestCloseInternal}>{"Cancel"}</MyButton>
              </View>
            </TouchableWithoutFeedback>
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    safeAreaView: {
      flex: 1,
      backgroundColor: theme.colors.screenBackGround,
      alignItems: "center",
    },
    modelView: {
      flex: 1,
      justifyContent: "center",
      paddingTop: 22,
      padding: 4,
      backgroundColor: theme.colors.screenBackGround,
    },
    modalText: {
      fontSize: 24,
      marginBottom: 15,
      textAlign: "center",
    },
  });

export default SelectReactionModal;
