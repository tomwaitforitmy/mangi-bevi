import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MyListItem from "../components/MyListItem";
import { Image } from "react-native-elements";
import MealSpeedDial from "../components/MealSpeedDial";
import TagList from "../components/TagList";
import { GetAuthorName } from "../common_functions/GetAuthorName";
import LinkedMealsList from "../components/LinkedMealsList";
import { GetLinkedMeals } from "../common_functions/GetLinkedMeals";
import MyTabMenu from "../components/MyTabMenu";
import { TITLES, mealTabMenuTitleArray } from "../constants/TabMenuTitles";
import AuthorBox from "../components/AuthorBox";
import SelectReactionModal from "../components/SelectReactionModal";
import ReactionsList from "../components/ReactionsList";
import * as mealCookedByUserActions from "../store/actions/mealCookedByUserAction";
import CookedByUserList from "../components/CookedByUserList";
import { WasMarkedThisWeek } from "../common_functions/WasMarkedThisWeek";
import MealCookedByUser from "../models/MealCookedByUser";
import { markedAsCooked } from "../notifications/MarkedAsCooked";
import { NAVIGATION_TITLES } from "../constants/NavigationTitles";
import * as usersActions from "../store/actions/usersAction";

function MealDetailScreen({ route, navigation }) {
  const { mealId, selectedTabMealDetail, updateRenderCounter } = route.params;
  const initiallySelectedTab = selectedTabMealDetail ?? TITLES.INFO;
  const initialIndex = mealTabMenuTitleArray.indexOf(initiallySelectedTab);
  const mealCookedByUser = useSelector(
    (state) => state.mealsCookedByUser.mealCookedByUser,
  );

  const availableMeals = useSelector((state) => state.meals.meals);
  const users = useSelector((state) => state.users.users);
  const user = useSelector((state) => state.users.user);
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);
  const authorName = GetAuthorName(selectedMeal.authorId, users);
  const editorName = GetAuthorName(selectedMeal.editorId, users);
  const dispatch = useDispatch();

  const allTags = useSelector((state) => state.tags.tags);
  const tagList = [];

  selectedMeal.tags.map((tagId) => {
    const found = allTags.find((tag) => tag.id === tagId);
    if (found) {
      tagList.push(found);
    }
  });

  const enableMarkCooked = !WasMarkedThisWeek(
    mealCookedByUser,
    mealId,
    user.id,
    Date.now(),
  );

  const isFavorite = user.favorites.includes(selectedMeal.id);

  const onToggleFavorite = async () => {
    const updateFavorites = async () => {
      await dispatch(usersActions.editFavorites(newUser));
    };

    let favorites = [...user.favorites];

    if (isFavorite) {
      favorites = favorites.filter((m) => m !== selectedMeal.id);
    } else {
      favorites.push(selectedMeal.id);
    }

    const newUser = { ...user, favorites };

    try {
      updateFavorites();
    } catch (error) {
      console.error("Error updating favorites: ", error);
    }
  };

  const onPressMarkCooked = async () => {
    const MarkCooked = async () => {
      const newMealCookedByUser = MealCookedByUser("error", mealId, user.id);
      await dispatch(
        mealCookedByUserActions.addMealCookedByUser(newMealCookedByUser),
      );
      await markedAsCooked(selectedMeal.title, mealId, user, users);
    };

    Alert.alert(
      "Did you cook this?",
      "This action cannot be undone and might send a push notification to the author to say thanks.",
      [
        {
          text: "Yes",
          onPress: () => MarkCooked(),
        },
        {
          text: "No",
          style: "cancel",
        },
      ],
    );
  };

  const ChangeSelectedTab = useCallback(
    (title) => {
      navigation.setParams({ selectedTabEdit: title });
      setSelectedTab(title);
    },
    [navigation],
  );

  const TrySelectRightTab = () => {
    //We are at the right
    if (selectedTab === TITLES.STEPS) {
      return;
    }
    if (selectedTab === TITLES.INFO) {
      childRef.current.swipe(1, TITLES.INGREDIENTS);
      return;
    }
    childRef.current.swipe(2, TITLES.STEPS);
  };

  const TrySelectLeftTab = () => {
    //We are at the left
    if (selectedTab === TITLES.INFO) {
      return;
    }
    if (selectedTab === TITLES.STEPS) {
      childRef.current.swipe(1, TITLES.INGREDIENTS);
      return;
    }
    childRef.current.swipe(0, TITLES.INFO);
  };

  const childRef = useRef();

  const linkedMeals = GetLinkedMeals(availableMeals, selectedMeal.links);

  const [selectedTab, setSelectedTab] = useState(initiallySelectedTab);
  const [showSelectReactionModal, setShowSelectReactionModal] = useState(false);

  const onRequestCloseModal = () => {
    setShowSelectReactionModal(false);
  };

  const onReactionSelected = (r) => {
    setShowSelectReactionModal(false);
  };

  //update the view if the initial position changes
  useEffect(() => {
    ChangeSelectedTab(initiallySelectedTab);
  }, [ChangeSelectedTab, initiallySelectedTab, updateRenderCounter]);

  useEffect(() => {
    try {
      dispatch(mealCookedByUserActions.fetchCookedByUsers(mealId));
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, mealId]);

  const windowWidth = useWindowDimensions().width;

  const touchX = useRef(0);

  return (
    <View
      style={styles.container}
      onTouchStart={(e) => (touchX.current = e.nativeEvent.pageX)}
      onTouchEnd={(e) => {
        if (touchX.current - e.nativeEvent.pageX > 100) {
          TrySelectRightTab();
        } else if (e.nativeEvent.pageX - touchX.current > 100) {
          TrySelectLeftTab();
        }
      }}>
      <SelectReactionModal
        onReactionSelected={onReactionSelected}
        onRequestClose={onRequestCloseModal}
        modalVisible={showSelectReactionModal}
        selectedMeal={selectedMeal}
      />

      <MyTabMenu
        ref={childRef}
        initialIndex={initialIndex}
        titles={mealTabMenuTitleArray}
        windowWidth={windowWidth}
        onTabPress={(title) => ChangeSelectedTab(title)}
        updateRenderCounter={updateRenderCounter} //to update if the initial position changes
      />
      <ScrollView style={styles.container}>
        {selectedTab === TITLES.INFO && (
          <View>
            <Text style={styles.subtitle}>{selectedMeal.title}</Text>
            <Image
              source={{
                uri: selectedMeal.primaryImageUrl
                  ? selectedMeal.primaryImageUrl
                  : "https://dummyimage.com/300x200&text=No+image+yet",
              }}
              style={styles.image}
              onPress={() => {
                navigation.navigate(NAVIGATION_TITLES.TAB_MEALS, {
                  screen: NAVIGATION_TITLES.STACK_IMAGES,
                  params: {
                    mealId: selectedMeal.id,
                    mealTitle: selectedMeal.title,
                  },
                });
              }}
            />
            <TagList tags={tagList} />
            <CookedByUserList
              //todo: is the filter needed here?
              cookedByUser={mealCookedByUser.filter((e) => e.mealId === mealId)}
              users={users}
            />
            <ReactionsList
              style={styles.reactions}
              reactions={selectedMeal.reactions}
              users={users}
            />
          </View>
        )}

        {selectedTab === TITLES.INGREDIENTS &&
          selectedMeal.ingredients.map((ingredient) => (
            <MyListItem
              key={ingredient}
              title={ingredient}
              searchTerm={searchTerm}
            />
          ))}
        {selectedTab === TITLES.STEPS &&
          selectedMeal.steps.map((step) => (
            <MyListItem key={step} title={step} searchTerm={searchTerm} />
          ))}
        {linkedMeals.length > 0 && selectedTab === TITLES.INFO && (
          <LinkedMealsList
            meals={linkedMeals}
            navigation={navigation}
            isAuthenticated={true}
          />
        )}

        {selectedTab === TITLES.INFO && (
          <AuthorBox
            authorName={authorName}
            editorName={editorName}
            creationDate={selectedMeal.creationDate}
            editDate={selectedMeal.editDate}
          />
        )}
      </ScrollView>
      <MealSpeedDial
        mealId={selectedMeal.id}
        navigation={navigation}
        isFavorite={isFavorite}
        onPressFavorite={() => onToggleFavorite()}
        onPressReact={() => setShowSelectReactionModal(true)}
        onPressMarkCooked={() => onPressMarkCooked(mealId, user.id)}
        enableMarkCooked={enableMarkCooked}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  reactions: {
    justifyContent: "center",
  },
  loginButton: {
    borderRadius: 0,
    height: "10%",
  },
  subtitle: {
    paddingTop: 10,
    paddingBottom: 15,
    fontSize: 22,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
  },
  container: {
    flex: 1,
  },
});

export default MealDetailScreen;
