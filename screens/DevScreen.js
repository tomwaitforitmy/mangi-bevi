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
        body: "A new mangi has been added.",
      },
      trigger: { seconds: 1 },
      data: { mangiId: "123" },
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
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await notifyMe();
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

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "New Mangi!",
      body: "A new mangi has been added.",
    },
    trigger: { seconds: 1 },
    data: { mangiId: "123" },
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
});

export default DevScreen;
