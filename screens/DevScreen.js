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

function DevScreen({ navigation }) {
  // const allMeals = useSelector((state) => state.meals.meals);
  // const [searchTerm, setSearchTerm] = useState("");

  // const lessMeals = FastFilterMeals(allMeals, searchTerm);

  // console.log(lessMeals.length);

  // const onChangeText = async (text) => {
  //   setSearchTerm(text);
  // };

  const textArray = [];
  textArray.push("Steps");
  textArray.push("Ingredients");
  textArray.push("Pictures");

  const windowWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      <MyTabMenu titles={textArray} windowWidth={windowWidth} />

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
