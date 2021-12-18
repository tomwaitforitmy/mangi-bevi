import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import { Image } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageSwipe from "../components/ImageSwipe";

function FiltersScreen({ navigation }) {
  // const [activeIndex, setActiveIndex] = useState(0);

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
      {/* <ImageSwipe images={images} width={width} /> */}
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
