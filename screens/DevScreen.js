import React from "react";
import { View, StyleSheet, Text, Pressable, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BulkEditMeal from "../components/BulkEditMeal";
import { FastFilterMeals } from "../common_functions/FastFilterMeals";
import TinyMealList from "../components/TinyMealList";
import SearchInput from "../components/SearchInput";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Button, Divider } from "react-native-elements";
import Colors from "../constants/Colors";
import MyTabMenu from "../components/MyTabMenu";
import * as Notifications from "expo-notifications";

function DevScreen({ navigation }) {
  async function notifyMe() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Mangi!",
        body: "Gebackene rote Zwiebeln mit Walnuss-Salsa",
        data: {
          mangiId: "-Mqf8oW0jKxIx5SIjz3F",
          title: "Gebackene rote Zwiebeln mit Walnuss-Salsa",
        },
      },
      trigger: { seconds: 1 },
    });
  }

  async function navToMeal() {
    navigation.navigate("Mangi & Bevi", {
      screen: "Details",
      params: {
        mealId: "-Mqf8oW0jKxIx5SIjz3F",
        mealTitle: "Gebackene rote Zwiebeln mit Walnuss-Salsa",
        isAuthenticated: true,
        updateRenderCounter: 0,
      },
    });
  }
  // const allMeals = useSelector((state) => state.meals.meals);
  // const [searchTerm, setSearchTerm] = useState("");

  // const lessMeals = FastFilterMeals(allMeals, searchTerm);

  // console.log(lessMeals.length);

  // const onChangeText = async (text) => {
  //   setSearchTerm(text);
  // };

  return (
    <View style={styles.container}>
      {/* <Button
        title="Schedule a notification"
        onPress={async () => {
          await notifyMe();
        }}
      /> */}
      <Button
        title="Navigate to meal"
        onPress={async () => {
          await navToMeal();
        }}
      />
      {/* <SearchInput onChangeText={onChangeText} />
      <TinyMealList
        meals={lessMeals}
        onPressMeal={(m) => console.log(m.title)}
        searchTerm={searchTerm}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
});

export default DevScreen;
