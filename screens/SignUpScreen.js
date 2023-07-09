import React from "react";
import AuthenticationContent from "../components/AuthenticationContent";

function SignUpScreen({ navigation }) {
  return (
    <AuthenticationContent
      navigation={navigation}
      login={false}
      passwordReset={false}
    />
  );
}

export default SignUpScreen;
