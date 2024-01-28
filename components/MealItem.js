import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import HighlightedText from "./HighlightedText";
import Colors from "../constants/Colors";

const MealItem = (props) => {
  return (
    <View style={{ ...styles.mealItem, ...props.style }}>
      <TouchableOpacity onPress={props.onSelectMeal}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: props.image
                ? props.image
                : "https://dummyimage.com/300x200&text=No+image+yet",
            }}
            style={styles.backgroundImage}
          />
        </View>
        <View style={styles.titleContainer}>
          {/* ellipsizeMode="tail" -> "..." on android */}
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            <HighlightedText text={props.title} searchTerm={props.searchTerm} />
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mealItem: {
    flex: 1,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  imageContainer: {
    height: "85%",
    borderRadius: 3,
  },
  backgroundImage: {
    height: "100%",
  },
  title: {
    fontSize: 20,
    overflow: "hidden",
    textAlignVertical: "center",
    color: "black",
  },
  titleContainer: {
    borderRadius: 3,
    justifyContent: "center",
    height: "15%",
    paddingHorizontal: 5,
    backgroundColor: Colors.white,
  },
});

export default MealItem;
