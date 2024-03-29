import React from "react";
import AuthenticationContent from "../components/AuthenticationContent";

function LoginScreen({ navigation }) {
  return (
    <AuthenticationContent
      navigation={navigation}
      login={true}
      passwordReset={false}
    />
  );
}
export default LoginScreen;
