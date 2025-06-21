import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LoadingIndicator from "../components/LoadingIndicator";
import { PrepareSelectedFriends } from "../common_functions/PrepareSelectedFriends";
import SearchInput from "../components/SearchInput";
import MultiSelectUsersList from "../components/MultiSelectUsersList";
import * as usersActions from "../store/actions/usersAction";
import { FastFilterUsers } from "../common_functions/FastFilterUsers";
import { NAVIGATION_TITLES } from "../constants/NavigationTitles";

function EditFriendsScreen({ navigation, route }) {
  //This is called when users.users AND state.users.user change
  //However, I don't understand why it is called between begin/end editUser once
  console.log("render call");

  const allUsers = useSelector((state) => state.users.users);
  const user = useSelector((state) => state.users.user);
  const otherUsers = allUsers.filter((u) => u.id !== user.id);
  const availableUsers = PrepareSelectedFriends(otherUsers, user.friends);

  let visibleUsers = null;

  const [searchTerm, setSearchTerm] = useState();

  const dispatch = useDispatch();

  const onChangeText = async (text) => {
    setSearchTerm(text);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onEndSelection = async (users) => {
    setIsLoading(true);
    const selectedFriends = users.filter((u) => u.isSelected);
    const editedUser = { ...user };
    editedUser.friends = selectedFriends.map((f) => f.id);

    await dispatch(usersActions.editFriends(editedUser));

    setIsLoading(false);

    navigation.popTo(NAVIGATION_TITLES.STACK_USER_PROFILE);
  };

  if (searchTerm) {
    visibleUsers = FastFilterUsers(availableUsers, searchTerm);
  }

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <SearchInput
        onChangeText={onChangeText}
        numberOfLabels={
          visibleUsers ? visibleUsers.length : availableUsers.length
        }
        label={"User"}
      />
      <MultiSelectUsersList
        users={availableUsers}
        visibleUsers={visibleUsers ? visibleUsers : availableUsers}
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
