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
      <BulkEditMeal></BulkEditMeal>
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
