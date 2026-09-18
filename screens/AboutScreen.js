import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import MyButton from "../components/MyButton";
import { useAppTheme } from "../theme/useAppTheme";

function AboutScreen() {
  const theme = useAppTheme();
  const styles = getStyles(theme);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.name}>{Constants.expoConfig.name}</Text>
        <Text style={styles.version}>
          Version {Constants.expoConfig.version}
        </Text>
        <MyButton onPress={() => router.push("/profile/about-licenses")}>
          {"Open Source Licenses"}
        </MyButton>
        <MyButton onPress={() => router.push("/profile/about-costs")}>
          {"Costs & Transparency"}
        </MyButton>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    name: {
      fontSize: 20,
      fontWeight: "bold",
      margin: 5,
      color: theme.colors.onBackground,
    },
    version: {
      fontSize: 14,
      lineHeight: 30,
      margin: 5,
      color: theme.colors.onBackground,
    },
  });

export default AboutScreen;
