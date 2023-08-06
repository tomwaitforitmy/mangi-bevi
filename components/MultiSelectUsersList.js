import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import MyButton from "./MyButton";
import TinyUserItem from "./TinyUserItem";

const MultiSelectUsersList = ({ users, onEndSelection, searchTerm }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <TinyUserItem user={item} searchTerm={searchTerm} />
        )}
        keyExtractor={(item) => item.id}
        estimatedItemSize={users.length}
      />
      <View style={styles.button}>
        <MyButton onPress={() => onEndSelection(users)}>
          {"Done selecting"}
        </MyButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  button: {
    padding: 5,
  },
});

export default MultiSelectUsersList;
