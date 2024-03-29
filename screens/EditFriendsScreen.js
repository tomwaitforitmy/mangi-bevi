import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LoadingIndicator from "../components/LoadingIndicator";
import { PrepareSelectedFriends } from "../common_functions/PrepareSelectedFriends";
import SearchInput from "../components/SearchInput";
import MultiSelectUsersList from "../components/MultiSelectUsersList";
import * as usersActions from "../store/actions/usersAction";
import { FastFilterUsers } from "../common_functions/FastFilterUsers";

function EditFriendsScreen({ navigation, route }) {
  //why is this called? allUsers changes?
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
    user.friends = selectedFriends.map((f) => f.id);
    await dispatch(usersActions.editFriends(user));
    setIsLoading(false);

    navigation.navigate({
      name: "UserProfileScreen",
    });
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
