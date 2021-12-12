import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import { Image } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageSwipe from "../components/ImageSwipe";

function FiltersScreen({ navigation }) {
  // const [activeIndex, setActiveIndex] = useState(0);

  const { width } = Dimensions.get("window");

  const images = [
    {
      url: "https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    },
    {
      url: "https://images.pexels.com/photos/9413/animal-cute-kitten-cat.jpg?cs=srgb&dl=adorable-animal-cat-9413.jpg&fm=jpg",
    },
    {
      url: "https://i.pinimg.com/236x/c6/6b/11/c66b111bf4df809e87a1208f75d2788b.jpg",
    },
    {
      url: "https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    },
    {
      url: "https://images.pexels.com/photos/9413/animal-cute-kitten-cat.jpg?cs=srgb&dl=adorable-animal-cat-9413.jpg&fm=jpg",
    },
    {
      url: "https://i.pinimg.com/236x/c6/6b/11/c66b111bf4df809e87a1208f75d2788b.jpg",
    },
  ];

  // renderItem = ({ item, index }) => {
  //   return (
  //     <View style={styles.slide}>
  //       <Image source={{ uri: item.url }} style={styles.image}></Image>
  //       {/* <Text>{item.url}</Text> */}
  //     </View>
  //   );
  // };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 50 }}>
      <ImageSwipe images={images} width={width} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default FiltersScreen;
