import React, { useState } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import SelectSortingBox from "./SelectSortingBox";
import MyButton from "./MyButton";

const SelectSortingModal = ({
  visible,
  onClose,
  onSelectSort,
  selectedItem,
}) => {
  const [selectedSort, setSelectedSort] = useState(selectedItem);
  const onSelectSortInternal = (sort) => {
    setSelectedSort(sort);
    onSelectSort(sort);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalText}>Sort Mangis by</Text>

        <SelectSortingBox
          selectedItem={selectedSort}
          onItemChanged={(i) => onSelectSortInternal(i)}
        />
        <MyButton onPress={onClose}>{"Cancel"}</MyButton>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: Colors.screenBackGround,
  },
  modalText: {
    fontSize: 24,
    marginBottom: 15,
    textAlign: "center",
  },
});

export default SelectSortingModal;
