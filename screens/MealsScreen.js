import React, { useEffect, useState } from "react";
import MealList from "../components/MealList";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Chip } from "react-native-elements";
import Colors from "../constants/Colors";
import { fetchAll } from "../firebase/fetchAll";
import IconTypes from "../constants/IconTypes";
import LoadingIndicator from "../components/LoadingIndicator";
import { FastFilterMeals } from "../common_functions/FastFilterMeals";
import SearchInput from "../components/SearchInput";
import * as searchAction from "../store/actions/searchAction";
import { TagFilterMeals } from "../common_functions/TagFilterMeals";
import { ContainsArray } from "../common_functions/ContainsArray";
import { DEV_MODE } from "../data/Environment";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../notifications/RegisterForPushNotifications";
import * as usersAction from "../store/actions/usersAction";
import { IsEmailValid } from "../common_functions/IsEmailValid";
import { enableAndFilter } from "../data/AvailableSettings";
import SelectSortingModal from "../components/SelectSortingModal";
import { LAST_CREATED } from "../data/AllowedSortingOptions";
import { SortMealsBy } from "../common_functions/SortMealBy";
import { NAVIGATION_TITLES } from "../constants/NavigationTitles";

function MealsScreen({ navigation }) {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showSortingModal, setShowSortingModal] = useState(false);
  const [selectedSortingType, setSelectedSortingType] = useState(LAST_CREATED);
  const [filteredMeals, setFilteredMeals] = useState([]);

  const user = useSelector((state) => state.users.user);
  const allMeals = useSelector((state) => state.meals.meals);
  const filterTags = useSelector((state) => state.tags.filterTags);
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const mealsCookedByUser = useSelector(
    (state) => state.mealsCookedByUser.mealsCookedByUser,
  );

  const filtersActive = filterTags.length > 0;

  const onPressTagsActiveHandler = () => {
    navigation.navigate(NAVIGATION_TITLES.TAB_FILTERS, {
      screen: NAVIGATION_TITLES.STACK_FILTER,
    });
  };

  const onToggleFavorites = () => {
    setShowFavorites((prev) => !prev);
    let mealsToShow = [];
    if (showFavorites) {
      mealsToShow = TagFilterMeals([...allMeals], tagIdsToFilter, false);
    } else {
      mealsToShow = allMeals.filter((m) => user.favorites.includes(m.id));
    }
    setFilteredMeals(mealsToShow);
  };

  const onChangeText = async (text) => {
    await dispatch(searchAction.setSearchTerm(text));
  };

  //Todo: Could this be placed somewhere else without useEffect?
  //Somehow I need this for the first refresh. onRefresh doesn't trigger
  useEffect(() => {
    setIsLoading(true);
    fetchAll(dispatch).then(() => setIsLoading(false));
  }, [dispatch]);

  const onRefresh = React.useCallback(() => {
    if (!user.id) {
      console.log("User data not loaded. Stop refreshing");
      return;
    }

    setRefreshing(true);
    fetchAll(dispatch).then(() => {
      const sortedMeals = SortMealsBy(
        [...filteredMeals],
        selectedSortingType,
        mealsCookedByUser,
        user.id,
      );
      setFilteredMeals(sortedMeals);
      setRefreshing(false);
    });
  }, [
    dispatch,
    filteredMeals,
    mealsCookedByUser,
    selectedSortingType,
    user?.id, //not always loaded
  ]);

  useEffect(() => {
    if (!user) {
      return;
    }
    //At least on my iPhone I experienced cases where there was an extra user, like this:
    //{"0": "E", "1": "R", "10": "S", "11": "E", "12": "R", "13": "_", "14": "L", "15": "O", "16": "G", "17": "G", "18": "E", "19": "D", "2": "R", "20": "_", "21": "I", "22": "N", "3": "O", "4": "R", "5": "_", "6": "N", "7": "O", "8": "_", "9": "U", "expoPushToken": "ExponentPushToken[validToken]"}
    //Everything was invalid except for the token.
    //This occurred when I was using expo go and didn't start the app for a while. Perhaps the user was forced to log out?
    //I chose to fix this by checking for a valid email.
    if (!user.email) {
      console.log("E-Mail is invalid. Will stop registering...");
      console.log("User", user);
      return;
    }
    if (!IsEmailValid(user.email)) {
      console.warn("E-Mail is invalid. Will stop registering...");
      console.warn("User", user);
      return;
    }
    //always surround await with try/catch in case the promise doesn't resolve
    try {
      registerForPushNotificationsAsync()
        .then((token) => {
          //Not a real device, don't do anything
          if (!token) {
            return;
          }
          //Token already in database, don't do anything
          if (token === user.expoPushToken) {
            return;
          } else {
            console.log("Token changed");
            console.log("new ", token);
            console.log("old ", user.expoPushToken);
          }
          console.log("Start register push notifications");

          const editedUser = { ...user };
          editedUser.expoPushToken = token;
          //Add or update token
          //Technically, we don't have to await here.
          //Not sure if this works.
          dispatch(usersAction.editExpoPushToken(editedUser));
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, user]);

  useEffect(() => {
    //let's navigate to meals here for now until the header issue is fixed.
    //https://github.com/react-navigation/react-navigation/issues/11773
    const subscriptionPushClicked =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const mangiId = response.notification.request.content.data.mangiId;
        const title = response.notification.request.content.data.title;
        console.log("Push clicked on " + title);

        //Todo: This can be tested again now with bottom-tabs and navigation 7
        navigation.navigate(NAVIGATION_TITLES.STACK_MEALS, {
          // mealId: mangiId,
          // mealTitle: title,
          // isAuthenticated: true,
          // updateRenderCounter: 0,
        });
      });

    return () => {
      subscriptionPushClicked.remove();
    };
  }, [navigation]);

  const onSelectSort = (sort) => {
    const sortedMeals = SortMealsBy(
      [...filteredMeals],
      sort,
      mealsCookedByUser,
      user.id,
    );
    setSelectedSortingType(sort);
    setFilteredMeals(sortedMeals);
    setShowSortingModal(false);
  };

  useEffect(() => {
    // Calculate filterOr when user.settings changes
    const filterAndSettingEnabled = user?.settings?.find(
      (s) => s.name === enableAndFilter,
    );

    // Filter meals based on updated settings and search term
    let meals = TagFilterMeals(
      [...allMeals],
      tagIdsToFilter,
      filterAndSettingEnabled ? false : true,
    );
    meals = FastFilterMeals(meals, searchTerm);

    setFilteredMeals(meals);
  }, [allMeals, filterTags, searchTerm, tagIdsToFilter, user?.settings]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const tagIdsToFilter = filterTags.map((t) => t.id);

  //To find new corrupt data
  if (DEV_MODE) {
    //To find corrupt data
    filteredMeals.map((m) => {
      if (ContainsArray(m.ingredients)) {
        console.error("⚡⚡⚡ Found corrupt INGREDIENTS");
        console.error(m.title);
      }
      if (ContainsArray(m.steps)) {
        console.error("⚡⚡⚡ Found corrupt STEPS");
        console.error(m.title);
      }
    });
  }

  return (
    <View style={styles.container}>
      <SelectSortingModal
        visible={showSortingModal}
        onClose={() => setShowSortingModal(false)}
        onSelectSort={(i) => onSelectSort(i)}
        selectedItem={LAST_CREATED}
      />
      <SearchInput
        onChangeText={onChangeText}
        numberOfLabels={filteredMeals.length}
        label={"Mangis"}
        showSortIcon={true}
        onSortPress={() => setShowSortingModal(true)}
      />
      <View style={styles.mealsScreen}>
        <View style={styles.overlay}>
          {showFavorites && (
            <Chip
              title={""}
              icon={{
                name: "star-off",
                color: Colors.navigationIcon,
                type: IconTypes.materialCommunityIcons,
              }}
              onPress={() => onToggleFavorites()}
              buttonStyle={{ backgroundColor: Colors.primary }}
            />
          )}
          {!showFavorites && (
            <Chip
              title={""}
              icon={{
                name: "star",
                color: Colors.navigationIcon,
                type: IconTypes.materialCommunityIcons,
              }}
              onPress={() => onToggleFavorites()}
              buttonStyle={{ backgroundColor: Colors.primary }}
            />
          )}
          {filtersActive && (
            <Chip
              title={"Active filters"}
              icon={{
                name: "filter",
                type: IconTypes.ionicon,
                size: 20,
                color: Colors.navigationIcon,
              }}
              onPress={() => onPressTagsActiveHandler()}
              buttonStyle={{ backgroundColor: Colors.second }}
            />
          )}
        </View>
        <MealList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
            />
          }
          mealsList={filteredMeals}
          navigation={navigation}
          searchTerm={searchTerm}
          isAuthenticated={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mealsScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    marginTop: 5,
    marginLeft: 5,
    zIndex: 1,
    opacity: 0.95,
    flexDirection: "row",
  },
});

export default MealsScreen;
