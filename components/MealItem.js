import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import HighlightedText from "./HighlightedText";
import Colors from "../constants/Colors";

const MealItem = (props) => {
  return (
    <View style={{ ...styles.mealItem, ...props.style }}>
      <TouchableOpacity onPress={props.onSelectMeal}>
        <View style={styles.mealRow}>
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
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="clip">
              <HighlightedText
                text={props.title}
                searchTerm={props.searchTerm}
              />
            </Text>
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
    // backgroundColor: "blue",
    borderRadius: 3,
    overflow: "hidden",
    // margin: 10,
    marginBottom: 8,
    // marginLeft: 5,
    // marginRight: 5,
  },
  mealRow: {
    // flexDirection: "column",
    // height: "100%", //change back to 85% tommy if you want more space below item
  },
  imageContainer: {
    height: "85%",
    borderRadius: 3,
  },
  backgroundImage: {
    // width: "100%",
    height: "100%",
    // justifyContent: "flex-end",
  },
  title: {
    fontSize: 14,
    // color: "white",
    overflow: "hidden",
    // textAlign: "left",
    textAlignVertical: "center",
    color: "black",
  },
  titleContainer: {
    // marginTop: 2,
    borderRadius: 3,
    justifyContent: "center",
    height: "15%",
    // paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: "darkgrey",
  },
});

export default MealItem;
