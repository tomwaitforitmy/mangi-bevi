import React, { useState } from "react";
import {
  Image,
  Platform,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
// import {
//   SafeAreaProvider,
//   SafeAreaView,
// } from "react-native-safe-area-context";
import Animated, {
  cancelAnimation,
  runOnJS,
  scrollTo,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";

function clamp(value, lowerBound, upperBound) {
  "worklet";
  return Math.max(lowerBound, Math.min(value, upperBound));
}

function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

function objectMove(object, from, to) {
  "worklet";
  const newObject = Object.assign({}, object);

  for (const id in object) {
    if (object[id] === from) {
      newObject[id] = to;
    }

    if (object[id] === to) {
      newObject[id] = from;
    }
  }

  return newObject;
}

function listToObject(list) {
  const values = Object.values(list);
  const object = {};

  for (let i = 0; i < values.length; i++) {
    object[values[i].id] = i;
  }

  return object;
}

const ALBUM_COVERS = {
  DISCOVERY:
    "https://static.wikia.nocookie.net/daftpunk/images/f/f3/Discovery_%28Album_Art%29.jpg/revision/latest/scale-to-width-down/600?cb=20100608175747",
  HUMAN_AFTER_ALL:
    "https://upload.wikimedia.org/wikipedia/en/0/0d/Humanafterall.jpg",
  HOMEWORK:
    "https://upload.wikimedia.org/wikipedia/en/9/9c/Daftpunk-homework.jpg",
  RANDOM_ACCESS_MEMORIES:
    "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg",
};

const DAFT_PUNK = "Daft Punk";

const SONGS = shuffle([
  {
    id: "one-more-time",
    title: "One More Time",
    artist: DAFT_PUNK,
    cover: ALBUM_COVERS.DISCOVERY,
  },
  {
    id: "digital-love",
    title: "Digital Love",
    artist: DAFT_PUNK,
    cover: ALBUM_COVERS.DISCOVERY,
  },
  {
    id: "nightvision",
    title: "Nightvision",
    artist: DAFT_PUNK,
    cover: ALBUM_COVERS.DISCOVERY,
  },
  {
    id: "something-about-us",
    title: "Something About Us",
    artist: DAFT_PUNK,
    cover: ALBUM_COVERS.DISCOVERY,
  },
  {
    id: "veridis-quo",
    title: "Veridis Quo",
    artist: DAFT_PUNK,
    cover: ALBUM_COVERS.DISCOVERY,
  },
  {
    id: "make-love",
    title: "Make Love",
    artist: DAFT_PUNK,
    cover: ALBUM_COVERS.HUMAN_AFTER_ALL,
  },
  {
    id: "television-rules-the-nation",
    title: "Television Rules the Nation",
    artist: DAFT_PUNK,
    cover: ALBUM_COVERS.HUMAN_AFTER_ALL,
  },
  {
    id: "phoenix",
    title: "Phoenix",
    artist: DAFT_PUNK,
    cover: ALBUM_COVERS.HOMEWORK,
  },
  {
    id: "revolution-909",
    title: "Revolution 909",
    artist: DAFT_PUNK,
    cover: ALBUM_COVERS.HOMEWORK,
  },
  {
    id: "around-the-world",
    title: "Around the World",
    artist: DAFT_PUNK,
    cover: ALBUM_COVERS.HOMEWORK,
  },
  {
    id: "within",
    title: "Within",
    artist: DAFT_PUNK,
    cover: ALBUM_COVERS.RANDOM_ACCESS_MEMORIES,
  },
  {
    id: "touch",
    title: "Touch (feat. Paul Williams)",
    artist: DAFT_PUNK,
    cover: ALBUM_COVERS.RANDOM_ACCESS_MEMORIES,
  },
  {
    id: "beyond",
    title: "Beyond",
    artist: DAFT_PUNK,
    cover: ALBUM_COVERS.RANDOM_ACCESS_MEMORIES,
  },
  {
    id: "motherboard",
    title: "Motherboard",
    artist: DAFT_PUNK,
    cover: ALBUM_COVERS.RANDOM_ACCESS_MEMORIES,
  },
]);

const SONG_HEIGHT = 70;
const SCROLL_HEIGHT_THRESHOLD = SONG_HEIGHT;

function Song({ artist, cover, title }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: SONG_HEIGHT,
        padding: 10,
      }}
    >
      <Image
        source={{ uri: cover }}
        style={{ height: 50, width: 50, borderRadius: 4 }}
      />

      <View
        style={{
          marginLeft: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 4,
          }}
        >
          {title}
        </Text>

        <Text style={{ fontSize: 12, color: "gray" }}>{artist}</Text>
      </View>
    </View>
  );
}

function MovableSong({
  id,
  artist,
  cover,
  title,
  positions,
  scrollY,
  songsCount,
}) {
  const dimensions = useWindowDimensions();
  const [moving, setMoving] = useState(false);
  const top = useSharedValue(positions.value[id] * SONG_HEIGHT);
  const isMovingActive = useSharedValue(false);

  useAnimatedReaction(
    () => positions.value[id],
    (currentPosition, previousPosition) => {
      if (currentPosition !== previousPosition) {
        if (!moving) {
          top.value = withSpring(currentPosition * SONG_HEIGHT);
        }
      }
    },
    [moving]
  );

  const gestureHandler = useAnimatedGestureHandler({
    onStart() {
      runOnJS(setMoving)(true);
      isMovingActive.value = true;
    },
    onActive(event) {
      const positionY = event.absoluteY + scrollY.value;

      if (positionY <= scrollY.value + SCROLL_HEIGHT_THRESHOLD) {
        // Scroll up
        scrollY.value = withTiming(0, { duration: 1500 });
      } else if (
        positionY >=
        scrollY.value + dimensions.height - SCROLL_HEIGHT_THRESHOLD
      ) {
        // Scroll down
        const contentHeight = songsCount * SONG_HEIGHT;
        const containerHeight = dimensions.height;
        const maxScroll = contentHeight - containerHeight;
        scrollY.value = withTiming(maxScroll, { duration: 1500 });
      } else {
        cancelAnimation(scrollY);
      }

      top.value = withTiming(positionY - SONG_HEIGHT, {
        duration: 16,
      });

      const newPosition = clamp(
        Math.floor(positionY / SONG_HEIGHT),
        0,
        songsCount - 1
      );

      if (newPosition !== positions.value[id]) {
        positions.value = objectMove(
          positions.value,
          positions.value[id],
          newPosition
        );
      }
    },
    onFinish() {
      top.value = positions.value[id] * SONG_HEIGHT;
      runOnJS(setMoving)(false);
      isMovingActive.value = false;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const zIndex = isMovingActive.value ? 100 : 0;
    const scale = isMovingActive.value ? 1.05 : 1;
    const shadowOpacity = isMovingActive.value ? 0.2 : 0;
    return {
      position: "absolute",
      left: 0,
      right: 0,
      top: top.value,
      zIndex: zIndex,
      shadowColor: "black",
      shadowOffset: {
        height: 0,
        width: 0,
      },
      shadowOpacity: withSpring(shadowOpacity),
      shadowRadius: 10,
      transform: [{ scale }],
    };
  }, [moving]);

  return (
    <Animated.View style={animatedStyle}>
      <BlurView intensity={isMovingActive.value ? 100 : 0} tint="light">
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={{ maxWidth: "80%" }}>
            <Song artist={artist} cover={cover} title={title} />
          </Animated.View>
        </PanGestureHandler>
      </BlurView>
    </Animated.View>
  );
}

export default function DragToSortCode() {
  const positions = useSharedValue(listToObject(SONGS));
  const scrollY = useSharedValue(0);
  const scrollViewRef = useAnimatedRef();

  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => scrollTo(scrollViewRef, 0, scrolling, false)
  );

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        // scrollEventThrottle={16}
        style={{
          flex: 1,
          position: "relative",
          backgroundColor: "white",
        }}
        contentContainerStyle={{
          height: SONGS.length * SONG_HEIGHT,
        }}
      >
        {SONGS.map((song) => (
          <MovableSong
            key={song.id}
            id={song.id}
            artist={song.artist}
            cover={song.cover}
            title={song.title}
            positions={positions}
            scrollY={scrollY}
            songsCount={SONGS.length}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}
