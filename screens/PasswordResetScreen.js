import React from "react";
import AuthenticationContent from "../components/AuthenticationContent";

function PasswordResetScreen({ navigation }) {
  return (
    <AuthenticationContent
      navigation={navigation}
      login={false}
      passwordReset={true}
    />
  );
}
export default PasswordResetScreen;
