import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSelector } from "react-redux";
import MyListItem from "../components/MyListItem";
import { Image } from "react-native-elements";
import MealSpeedDial from "../components/MealSpeedDial";
import TagList from "../components/TagList";
import { GetAuthorName } from "../common_functions/GetAuthorName";
import LinkedMealsList from "../components/LinkedMealsList";
import { GetLinkedMeals } from "../common_functions/GetLinkedMeals";
import MyButton from "../components/MyButton";
import MyTabMenu from "../components/MyTabMenu";
import { TITLES, mealTabMenuTitleArray } from "../constants/TabMenuTitles";
import AuthorBox from "../components/AuthorBox";
import SelectReactionModal from "../components/SelectReactionModal";
import ReactionsList from "../components/ReactionsList";

function MealDetailScreen({ route, navigation }) {
  const {
    mealId,
    isAuthenticated,
    selectedTabMealDetail,
    updateRenderCounter,
  } = route.params;
  const initiallySelectedTab = selectedTabMealDetail ?? TITLES.INFO;
  const initialIndex = mealTabMenuTitleArray.indexOf(initiallySelectedTab);

  const availableMeals = useSelector((state) => state.meals.meals);
  const users = useSelector((state) => state.users.users);
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);
  const authorName = GetAuthorName(selectedMeal.authorId, users);
  const editorName = GetAuthorName(selectedMeal.editorId, users);

  const allTags = useSelector((state) => state.tags.tags);
  const tagList = [];

  selectedMeal.tags.map((tagId) => {
    const found = allTags.find((tag) => tag.id === tagId);
    if (found) {
      tagList.push(found);
    }
  });

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

  const windowWidth = useWindowDimensions().width;

  return (
    <View
      style={styles.container}
      onTouchStart={(e) => (this.touchX = e.nativeEvent.pageX)}
      onTouchEnd={(e) => {
        if (this.touchX - e.nativeEvent.pageX > 20) {
          TrySelectRightTab();
        } else if (e.nativeEvent.pageX - this.touchX > 20) {
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
                navigation.navigate("ImagesScreen", {
                  mealId: selectedMeal.id,
                  mealTitle: selectedMeal.title,
                });
              }}
            />
            <TagList tags={tagList} />
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
            isAuthenticated={isAuthenticated}
          />
        )}

        {isAuthenticated && selectedTab === TITLES.INFO && (
          <AuthorBox
            authorName={authorName}
            editorName={editorName}
            creationDate={selectedMeal.creationDate}
            editDate={selectedMeal.editDate}
          />
        )}
      </ScrollView>
      {isAuthenticated && (
        <MealSpeedDial
          mealId={selectedMeal.id}
          navigation={navigation}
          onPressReact={() => setShowSelectReactionModal(true)}
        />
      )}
      {!isAuthenticated && (
        <MyButton
          style={styles.loginButton}
          onPress={() => {
            navigation.navigate("LoginScreen");
          }}>
          {"Login or sign up"}
        </MyButton>
      )}
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
