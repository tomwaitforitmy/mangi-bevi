import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import MyButton from "./MyButton";
import TinyUserItem from "./TinyUserItem";

const MultiSelectUsersList = ({
  users,
  visibleUsers,
  onEndSelection,
  searchTerm,
}) => {
  let hideUsers = false;
  if (visibleUsers && users.length !== visibleUsers.length) {
    hideUsers = true;
  }

  const isVisible = (userId, visUsers) => {
    if (visUsers) {
      const visibleIds = visUsers.map((u) => u.id);
      if (visibleIds.includes(userId)) {
        return true;
      }
    }
    return false;
  };

  const renderItem = (item, showAll) => {
    if (showAll) {
      return <TinyUserItem user={item} searchTerm={searchTerm} />;
    }
    const show = isVisible(item.id, visibleUsers);

    if (show) {
      return <TinyUserItem user={item} searchTerm={searchTerm} />;
    }
    return <></>;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => renderItem(item, !hideUsers)}
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
