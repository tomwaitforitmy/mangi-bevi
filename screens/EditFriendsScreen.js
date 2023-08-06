import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LoadingIndicator from "../components/LoadingIndicator";
import { PrepareSelectedLinks } from "../common_functions/PrepareSelectedLinks";
import SearchInput from "../components/SearchInput";
import MultiSelectUsersList from "../components/MultiSelectUsersList";
import * as usersActions from "../store/actions/usersAction";
import { FastFilterUsers } from "../common_functions/FastFilterUsers";

function EditFriendsScreen({ navigation, route }) {
  const allUsers = useSelector((state) => state.users.users);
  const user = useSelector((state) => state.users.user);
  let availableUsers = allUsers.filter((u) => u.id !== user.id);

  const [searchTerm, setSearchTerm] = useState();

  const dispatch = useDispatch();

  const onChangeText = async (text) => {
    setSearchTerm(text);
  };

  PrepareSelectedLinks(availableUsers, user.friends);

  const [isLoading, setIsLoading] = useState(false);

  const onEndSelection = async (users) => {
    setIsLoading(true);
    const selectedFriends = users.filter((u) => u.isSelected);
    user.friends = selectedFriends;
    await dispatch(usersActions.editFriends(user));
    setIsLoading(false);

    navigation.navigate({
      name: "UserProfileScreen",
    });
  };

  if (searchTerm) {
    availableUsers = FastFilterUsers(availableUsers, searchTerm);
  }

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <SearchInput onChangeText={onChangeText} />
      <MultiSelectUsersList
        users={availableUsers}
        onEndSelection={onEndSelection}
        searchTerm={searchTerm}
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

export default EditFriendsScreen;
