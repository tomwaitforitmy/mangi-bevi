import React from "react";
import { ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";

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
            <View
              style={{ width: props.width, overflow: "hidden" }}
              key={index}
            >
              <ImageBackground source={{ uri: item }} style={styles.image}>
                <View style={styles.iconMenuView}>
                  {props.onTrashCallback && (
                    <Icon
                      color="#ccc"
                      reverse
                      reverseColor="black"
                      size={14}
                      type="feather"
                      name="trash"
                      onPress={() => props.onTrashCallback(index)}
                    />
                  )}
                  {props.onCheckCallback && (
                    <Icon
                      color="#ccc"
                      reverse
                      reverseColor="black"
                      size={14}
                      type="feather"
                      name="check-circle"
                      onPress={() => props.onCheckCallback(index)}
                    />
                  )}
                </View>
              </ImageBackground>
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
  iconMenuView: {
    width: "100%", //this is because icon "overflow" to right
    height: "100%",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-evenly",
  },
});

export default ImageSwipe;
