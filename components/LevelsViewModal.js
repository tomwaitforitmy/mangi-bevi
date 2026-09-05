import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../theme/useAppTheme";
import MyButton from "./MyButton";
import MyLevelViewContainer from "./MyLevelViewContainer";

const LevelsViewModal = ({
  modalVisible,
  onRequestClose,
  countMeals,
  countTags,
  countIngredients,
}) => {
  const theme = useAppTheme();
  const styles = getStyles(theme);

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={onRequestClose}>
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    </Modal>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    safeAreaView: {
      flex: 1,
      backgroundColor: theme.colors.screenBackGround,
    },
    modelView: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "stretch",
      paddingTop: 22,
      padding: 4,
      width: "100%",
      backgroundColor: theme.colors.screenBackGround,
    },
    modalText: {
      fontSize: 24,
      marginBottom: 15,
      textAlign: "center",
    },
  });

export default LevelsViewModal;
