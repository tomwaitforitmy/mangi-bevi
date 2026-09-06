import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { useAppTheme } from "../theme/useAppTheme";
import LoadingIndicator from "./LoadingIndicator";
import SwipeableImage from "./SwipeableImage";

const ImageSwipe = (props) => {
  const theme = useAppTheme();
  const styles = getStyles(theme);
  const images = props.images.map((item, index) => {
    var rObj = {};
    rObj.url = item;
    rObj.index = index;
    return rObj;
  });

  const { onCheckCallback, onTrashCallback } = props;

  return (
    <ImageViewer
      // react-native-image-zoom-viewer only builds its internal image-size
      // state in componentDidMount; it never reacts to imageUrls prop
      // changes. Without a key that changes when the list does, a newly
      // added (or removed) image renders as a blank view forever. Forcing
      // a remount here is the simplest way to make it pick the change up.
      key={props.images.join("|")}
      index={props.index}
      style={{ ...styles.container, ...props.style }}
      imageUrls={images}
      useNativeDriver={true}
      loadingRender={() => <LoadingIndicator style={props.style} />}
      //I thought of renaming props here to solve the warning, but decided against it.
      renderImage={(props) => (
        <SwipeableImage
          {...props}
          onCheckCallback={onCheckCallback}
          onTrashCallback={onTrashCallback}
        />
      )}
      saveToLocalByLongPress={false}
      backgroundColor={theme.colors.screenBackGround}
      // react-native-image-zoom-viewer's default "current/total" indicator
      // is hardcoded to white text, designed for its usual black photo-
      // viewer backdrop -- nearly invisible against our light-mode
      // screenBackGround. Re-render it with the same layout but a
      // theme-aware color.
      renderIndicator={(currentIndex, allSize) => (
        <View style={styles.indicator}>
          <Text style={styles.indicatorText}>
            {currentIndex + "/" + allSize}
          </Text>
        </View>
      )}
    />
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
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
    // Mirrors react-native-image-zoom-viewer's default indicator
    // positioning (image-viewer.style.js's `count`/`countText`).
    indicator: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 38,
      zIndex: 13,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    indicatorText: {
      color: theme.colors.onBackground,
      fontSize: 16,
      backgroundColor: "transparent",
    },
  });

export default ImageSwipe;
