import React from "react";
import { Modal, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import MyButton from "./MyButton";
import MyLevelViewContainer from "./MyLevelViewContainer";

const LevelsViewModal = ({
  modalVisible,
  onRequestClose,
  countMeals,
  countTags,
  countIngredients,
}) => {
  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={onRequestClose}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.modelView}>
          <Text style={styles.modalText}>Yummy lecker! 😋</Text>
          <MyLevelViewContainer
            numberOfRecipes={countMeals}
            numberOfTags={countTags}
            numberOfIngredients={countIngredients}
          />
          <MyButton onPress={onRequestClose}> {"Ok"}</MyButton>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.screenBackGround,
  },
  modelView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingTop: 22,
    padding: 4,
    width: "100%",
    backgroundColor: Colors.screenBackGround,
  },
  modalText: {
    fontSize: 24,
    marginBottom: 15,
    textAlign: "center",
  },
});

export default LevelsViewModal;
