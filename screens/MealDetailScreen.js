import React, { useState } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { useSelector } from "react-redux";
import MyListItem from "../components/MyListItem";
import { Image, SpeedDial } from "react-native-elements";
import Colors from "../constants/Colors";

function MealDetailScreen({ route, navigation }) {
  const { mealId } = route.params;
  const [open, setOpen] = useState(false);

  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
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
        ></Image>
        <Text style={styles.subtitle}>Ingredients</Text>
        {selectedMeal.ingredients.map((ingredient) => (
          <MyListItem key={ingredient} title={ingredient}></MyListItem>
        ))}
        <Text style={styles.subtitle}>Steps</Text>
        {selectedMeal.steps.map((step) => (
          <MyListItem key={step} title={step}></MyListItem>
        ))}
      </ScrollView>
      <SpeedDial
        color={Colors.primary}
        isOpen={open}
        icon={{ name: "add", color: "#fff" }}
        openIcon={{ name: "close", color: "#fff" }}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}
      >
        <SpeedDial.Action
          icon={{ name: "tag", color: "#fff" }}
          title="Tag"
          color={Colors.primary}
          onPress={() => console.log("Add Something")}
        />
        <SpeedDial.Action
          icon={{ name: "share", color: "#fff" }}
          title="Share"
          color={Colors.primary}
          onPress={() => console.log("Add Something")}
        />
        <SpeedDial.Action
          icon={{ name: "star", color: "#fff" }}
          title="Rate"
          color={Colors.primary}
          onPress={() => console.log("Delete Something")}
        />
      </SpeedDial>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
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
