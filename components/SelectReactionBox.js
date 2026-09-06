import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ALLOWED_REACTIONS } from "../data/AllowedReactions";
import { useAppTheme } from "../theme/useAppTheme";

const SelectReactionBox = (props) => {
  const theme = useAppTheme();
  const styles = getStyles(theme);

  return (
    <View style={{ ...styles.container, ...props.style }}>
      {ALLOWED_REACTIONS.map((r) => {
        const selectedReaction = r === props.selectedReaction;
        return (
          <TouchableOpacity key={r} onPress={() => props.onReactionSelected(r)}>
            <Text
              style={[
                styles.emoji,
                selectedReaction ? styles.selectedEmoji : styles.emoji,
              ]}>
              {r}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      borderRadius: 11,
      backgroundColor: theme.colors.surfaceVariant,
    },
    emoji: {
      // height: 28, only needed on DevScreen with buttons?
      padding: 5,
      overflow: "hidden",
      margin: 1,
      fontSize: 44,
      textAlign: "center",
      textAlignVertical: "center",
    },
    selectedEmoji: {
      borderRadius: 11,
      // selectedMealBackground is nearly indistinguishable from
      // surfaceVariant in every theme (a near-1:1 contrast ratio) -- it
      // was designed as a subtle tint elsewhere, not a visible selection
      // indicator. theme.colors.primary reads clearly as "selected" in
      // all three themes.
      backgroundColor: theme.colors.primary,
    },
  });

export default SelectReactionBox;
