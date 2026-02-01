import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import HighlightedText from "./HighlightedText";
import Colors from "../constants/Colors";
import ReactionsBox from "./ReactionsBox";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

const MealItem = (props) => {
  return (
    <View style={{ ...styles.mealItem, ...props.style }}>
      <TouchableOpacity onPress={props.onSelectMeal}>
        <View style={styles.imageContainer}>
          <ReactionsBox style={styles.reactions} reactions={props.reactions} />
          <Image
            source={{
              uri: props.image
                ? props.image
                : "https://dummyimage.com/300x200&text=No+image+yet",
            }}
            style={styles.backgroundImage}
          />
          {props.isFavorite && (
            <View style={styles.starBackground}>
              <MaterialDesignIcons name="star" color="#FFD700" size={22} />
            </View>
          )}
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
  reactions: {
    alignSelf: "flex-end",
    position: "absolute",
    zIndex: 1,
  },
  favoriteIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    zIndex: 2,
  },
  starBackground: {
    position: "absolute",
    bottom: 5,
    right: 5,
    zIndex: 2,
    backgroundColor: "rgba(5, 113, 255, 0.7)",
    borderRadius: 20,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
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
