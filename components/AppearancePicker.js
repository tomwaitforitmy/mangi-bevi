import React from "react";
import { StyleSheet, View } from "react-native";
import { useAppearanceSelection } from "../theme/useAppearanceSelection";
import { LIGHT, DARK, COLORFUL, AUTOMATIC } from "../theme/AppearanceOptions";
import MySwitch from "./Switches/MySwitch";

const OPTIONS = [
  { value: LIGHT, label: "Light" },
  { value: DARK, label: "Dark" },
  { value: COLORFUL, label: "Colorful" },
  { value: AUTOMATIC, label: "Automatic" },
];

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});

const AppearancePicker = () => {
  const { selection, setSelection } = useAppearanceSelection();

  return (
    <View style={styles.container} testID="appearance-picker">
      {OPTIONS.map((option) => (
        <MySwitch
          key={option.value}
          testID={`appearance-option-${option.value}`}
          descriptionText={option.label}
          modeOnOff={true}
          value={option.value === selection}
          // Exactly one option is always selected; switching one on selects
          // it, switching the active one off has no next state so it's a no-op.
          onValueChange={(v) => v && setSelection(option.value)}
        />
      ))}
    </View>
  );
};

export default AppearancePicker;
