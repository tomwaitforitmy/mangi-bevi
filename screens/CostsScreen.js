import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";

const generatedCostsConfig = require("../data/CostsConfig.js");
const generatedDevHoursEstimate = require("../data/generated/devHoursEstimate.json");

function formatEur(amount) {
  return `€${amount.toLocaleString("de-DE", { maximumFractionDigits: 2 })}`;
}

function CostsScreen({
  costsConfig = generatedCostsConfig,
  devHoursEstimate = generatedDevHoursEstimate,
}) {
  const theme = useAppTheme();
  const styles = getStyles(theme);

  const monetaryTotal = costsConfig.monetaryCosts.reduce(
    (sum, item) => sum + item.amountEur,
    0,
  );
  const devHoursCost =
    devHoursEstimate.estimatedHours * costsConfig.hourlyRateEur;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headline}>Real monetary costs</Text>
      {costsConfig.monetaryCosts.map((item) => (
        <View key={item.label} style={styles.row}>
          <Text style={styles.rowLabel}>{item.label}</Text>
          <Text style={styles.rowAmount}>{formatEur(item.amountEur)}</Text>
        </View>
      ))}
      <View style={styles.row}>
        <Text style={styles.rowLabelBold}>Total real cost</Text>
        <Text style={styles.rowAmountBold}>{formatEur(monetaryTotal)}</Text>
      </View>
      <Text style={styles.asOf}>As of {costsConfig.asOf}</Text>

      <Text style={styles.headline}>Estimated developer time</Text>
      <Text style={styles.paragraph}>
        {devHoursEstimate.estimatedHours} hours at {formatEur(costsConfig.hourlyRateEur)}
        /hour ≈ {formatEur(Math.round(devHoursCost))}
      </Text>
      <Text style={styles.paragraph}>{devHoursEstimate.methodology}</Text>

      <Text style={styles.freeStatement}>
        Mangi & Bevi will always remain free of charge and free of
        advertising.
      </Text>
    </ScrollView>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 12,
    },
    headline: {
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 16,
      marginBottom: 8,
      color: theme.colors.onBackground,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 4,
    },
    rowLabel: {
      fontSize: 14,
      color: theme.colors.onBackground,
      flexShrink: 1,
      paddingRight: 8,
    },
    rowAmount: {
      fontSize: 14,
      color: theme.colors.onBackground,
    },
    rowLabelBold: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.colors.onBackground,
    },
    rowAmountBold: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.colors.onBackground,
    },
    asOf: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      marginTop: 4,
    },
    paragraph: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.onBackground,
      marginBottom: 8,
    },
    freeStatement: {
      fontSize: 15,
      fontWeight: "bold",
      marginTop: 16,
      marginBottom: 24,
      color: theme.colors.onBackground,
    },
  });

export default CostsScreen;
