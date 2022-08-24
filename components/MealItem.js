import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

const MealItem = (props) => {
  return (
    <View style={{ ...styles.mealItem, ...props.style }}>
      <TouchableOpacity onPress={props.onSelectMeal}>
        <View>
          <View style={{ ...styles.mealRow, ...styles.mealHeader }}>
            <ImageBackground
              source={{
                uri: props.image
                  ? props.image
                  : "https://dummyimage.com/300x200&text=No+image+yet",
              }}
              style={styles.backgroundImage}>
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={1}>
                  {props.title}
                </Text>
              </View>
            </ImageBackground>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mealItem: {
    flex: 1,
    height: 200,
    backgroundColor: "#ccc",
    borderRadius: 3,
    overflow: "hidden",
    margin: 10,
  },
  mealRow: {
    flexDirection: "row",
  },
  mealHeader: {
    height: "100%", //change back to 85% tommy if you want more space below item
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 20,
    color: "white",
  },
  titleContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default MealItem;
