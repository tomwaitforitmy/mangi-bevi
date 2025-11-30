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
import MyButton from "../components/MyButton";
import MyTabMenu from "../components/MyTabMenu";
import { TITLES, mealTabMenuTitleArray } from "../constants/TabMenuTitles";
import { NAVIGATION_TITLES } from "../constants/NavigationTitles";

function MealDetailScreenNotAuthenticated({ route, navigation }) {
  const { mealId, selectedTabMealDetail, updateRenderCounter } = route.params;
  const initiallySelectedTab = selectedTabMealDetail ?? TITLES.INFO;
  const initialIndex = mealTabMenuTitleArray.indexOf(initiallySelectedTab);

  const availableMeals = useSelector((state) => state.meals.meals);
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

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

  const [selectedTab, setSelectedTab] = useState(initiallySelectedTab);

  //update the view if the initial position changes
  useEffect(() => {
    ChangeSelectedTab(initiallySelectedTab);
  }, [ChangeSelectedTab, initiallySelectedTab, updateRenderCounter]);

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
                //We navigate to another instance if logged out
                navigation.navigate(NAVIGATION_TITLES.LOGGED_OUT_IMAGES, {
                  mealId: selectedMeal.id,
                  mealTitle: selectedMeal.title,
                });
              }}
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
      </ScrollView>
      <MyButton
        style={styles.loginButton}
        onPress={() => {
          navigation.navigate(NAVIGATION_TITLES.LOGIN);
        }}>
        {"Login or sign up"}
      </MyButton>
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

export default MealDetailScreenNotAuthenticated;
