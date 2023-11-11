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
import { Button } from "react-native-elements";

const numberOfTabs = 2;
const windowWidth = Dimensions.get("window").width;
const tabWith = windowWidth / numberOfTabs;

function DevScreen({ navigation }) {
  // const allMeals = useSelector((state) => state.meals.meals);
  // const [searchTerm, setSearchTerm] = useState("");

  // const lessMeals = FastFilterMeals(allMeals, searchTerm);

  // console.log(lessMeals.length);

  // const onChangeText = async (text) => {
  //   setSearchTerm(text);
  // };

  const indexArray = [];
  for (let index = 0; index < numberOfTabs; index++) {
    indexArray.push(index);
  }

  const position = useSharedValue(0);

  const selectedButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      left: position.value,
      right: 0,
      top: 0,
      width: tabWith,
    };
  });

  const handlePress = (index) => {
    position.value = withSpring(tabWith * index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonGroup}>
        <Animated.View
          style={[styles.selectedButton, selectedButtonAnimatedStyle]}
        />
        {indexArray.map((i) => (
          <Pressable
            key={i}
            style={styles.menuButton}
            onPress={() => handlePress(i)}>
            <Text style={styles.text}>category {i}</Text>
          </Pressable>
        ))}
        {/* <Pressable style={styles.menuButton} onPress={() => handlePress(1)}>
          <Text style={styles.text}>category 2</Text>
        </Pressable>
        <Pressable style={styles.menuButton} onPress={() => handlePress(2)}>
          <Text style={styles.text}>category 3</Text>
        </Pressable> */}
      </View>
      <Button title={"filler"}></Button>

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
  text: {
    textAlign: "center",
  },
  menuButton: {
    height: "100%",
    width: tabWith,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },
  selectedButton: {
    backgroundColor: "green",
    height: "100%",
  },
  buttonGroup: {
    // position: "absolute",
    flex: 1,
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    maxHeight: 50,
  },
  container: {
    // margin: 10,
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
});

export default DevScreen;
