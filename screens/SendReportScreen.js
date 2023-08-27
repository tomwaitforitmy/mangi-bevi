import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MyButton from "../components/MyButton";
import * as reportsAction from "../store/actions/reportsAction";
import LoadingIndicator from "../components/LoadingIndicator";
import Report from "../models/Report";
import Colors from "../constants/Colors";

function SendReportScreen({ navigation, route }) {
  const user = useSelector((state) => state.users.user);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { mealId, mealTitle } = route.params;

  const dispatch = useDispatch();

  const sendReport = async () => {
    setIsLoading(true);
    const report = new Report(
      "error",
      description,
      mealId,
      user.id,
      mealTitle,
      user.name,
      "not reviewed",
      "not reviewed",
    );

    await dispatch(reportsAction.createReport(report));

    setIsLoading(false);
    Alert.alert(
      "Thank you",
      "Thanks for your commitment. We will review the case as soon as possible.",
    );
    navigation.goBack();
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.description}>
          <Text style={styles.description}>
            You may report inappropriate content such as hate, sexism or insults
            and so on. Please describe: Where is inappropriate content? For
            example in ingredients, pictures or the user name? Why is it
            inappropriate?
          </Text>
          <TextInput
            editable
            multiline
            numberOfLines={20}
            // maxLength={40}
            onChangeText={(text) => setDescription(text)}
            value={description}
            style={styles.descriptionInput}
            placeholder="Please write a description."
          />
          <MyButton onPress={() => sendReport()}>{"Send Report"}</MyButton>
          <MyButton onPress={() => navigation.goBack()}>{"Abort"}</MyButton>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  description: {
    fontSize: 14,
    margin: 5,
  },
  descriptionInput: { padding: 10, backgroundColor: Colors.white },
});

export default SendReportScreen;
