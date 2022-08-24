import React from "react";
import { StyleSheet } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import Colors from "../constants/Colors";
import LoadingIndicator from "./LoadingIndicator";
import SwipeableImage from "./SwipeableImage";

const ImageSwipe = (props) => {
  const images = props.images.map((item, index) => {
    var rObj = {};
    rObj.url = item;
    rObj.index = index;
    return rObj;
  });

  const { onCheckCallback, onTrashCallback } = props;

  return (
    <ImageViewer
      style={{ ...styles.container, ...props.style }}
      imageUrls={images}
      useNativeDriver={true}
      loadingRender={() => LoadingIndicator(props)}
      //I thought of renaming props here to solve the warning, but decided against it.
      renderImage={(props) => (
        <SwipeableImage
          {...props}
          onCheckCallback={onCheckCallback}
          onTrashCallback={onTrashCallback}
        />
      )}
      saveToLocalByLongPress={false}
      backgroundColor={Colors.screenBackGround}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200, //if removed, the height is 0 in new screen???
    width: "100%",
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
