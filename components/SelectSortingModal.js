import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import SelectSortingBox from "./SelectSortingBox";
import MyButton from "./MyButton";
import { useDispatch } from "react-redux";
import * as mealCookedByUserActions from "../store/actions/mealCookedByUserAction";
import LoadingIndicator from "./LoadingIndicator";

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
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          await dispatch(mealCookedByUserActions.fetchMealsCookedByUsers());
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [visible, dispatch]);

  useEffect(() => {
    if (!visible) {
      setIsLoading(false);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <Text style={styles.modalText}>Sort Mangis by</Text>

            <SelectSortingBox
              selectedItem={selectedSort}
              onItemChanged={(i) => onSelectSortInternal(i)}
            />
          </>
        )}
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
