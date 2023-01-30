import React, { useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import BulkEditMeal from "../components/BulkEditMeal";
import LevelsViewModal from "../components/LevelsViewModal";

function DevScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const onRequestClose = () => {
    console.log("closed");
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      <Button
        title="Change Modal"
        onPress={() => setModalVisible(!modalVisible)}
      />
      <LevelsViewModal
        countIngredients={13}
        countTags={0}
        countMeals={0}
        modalVisible={modalVisible}
        onRequestClose={onRequestClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});

export default DevScreen;
