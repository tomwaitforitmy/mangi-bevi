import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Image } from "react-native-elements";

const ImageSwipe = (props) => {
  return (
    <View style={{ ...styles.container, ...props.style }}>
      <ScrollView
        style={{ flex: 1 }}
        horizontal={true}
        decelerationRate="fast"
        snapToInterval={props.width} //your element width
        snapToAlignment={"center"}
        pinchGestureEnabled={true}
      >
        {props.images &&
          props.images.map((item, index) => (
            <View style={{ width: props.width }} key={index}>
              <Image source={{ uri: item }} style={styles.image}></Image>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ImageSwipe;
