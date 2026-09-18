import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
const generatedLicenseData = require("../data/generated/openSourceLicenses.json");

function LicenseRow({ item, theme, styles }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      onPress={() => setExpanded((prev) => !prev)}
      accessibilityRole="button">
      <View style={styles.row}>
        <Text style={styles.packageName}>{item.packageName}</Text>
        <Text style={styles.licenseType}>{item.license}</Text>
        {expanded && <Text style={styles.licenseText}>{item.licenseText}</Text>}
      </View>
    </Pressable>
  );
}

function OpenSourceLicensesScreen({ licenseData = generatedLicenseData }) {
  const theme = useAppTheme();
  const styles = getStyles(theme);
  const packages = licenseData.packages;

  if (packages.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyMessage}>
          No open source license requires attribution in this build.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={packages}
      keyExtractor={(item) => `${item.packageName}@${item.version}`}
      renderItem={({ item }) => (
        <LicenseRow item={item} theme={theme} styles={styles} />
      )}
    />
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    row: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.outline,
    },
    packageName: {
      fontSize: 15,
      fontWeight: "bold",
      color: theme.colors.onBackground,
    },
    licenseType: {
      fontSize: 13,
      color: theme.colors.onSurfaceVariant,
      marginTop: 2,
    },
    licenseText: {
      fontSize: 12,
      color: theme.colors.onBackground,
      marginTop: 8,
      lineHeight: 18,
    },
    emptyMessage: {
      fontSize: 14,
      margin: 12,
      color: theme.colors.onBackground,
    },
  });

export default OpenSourceLicensesScreen;
