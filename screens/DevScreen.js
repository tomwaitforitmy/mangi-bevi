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

const numberOfTabs = 3;
const paddingLeftRight = 5;
const windowWidth = Dimensions.get("window").width;
//we remove 2 times the site padding and we have 2 pixel
const tabWith = (windowWidth - 2 - paddingLeftRight * 2) / numberOfTabs;

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

  const position = useSharedValue(1);

  const selectedButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      left: position.value,
      right: 1,
      top: 1,
      width: tabWith,
    };
  });

  const handlePress = (index) => {
    position.value = withSpring(1 + tabWith * index);
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
  },
  selectedButton: {
    backgroundColor: Colors.screenBackGround,
    height: "100%",
    borderRadius: 5,
  },
  buttonGroup: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    maxHeight: 35,
    backgroundColor: "lightgrey",
    borderRadius: 5,
    paddingBottom: 2,
    marginBottom: 5,
  },
  container: {
    paddingTop: 5,
    paddingLeft: paddingLeftRight,
    paddingRight: paddingLeftRight,
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
});

export default DevScreen;
