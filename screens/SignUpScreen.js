import React from "react";
import AuthenticationContent from "../components/AuthenticationContent";

function SignUpScreen({ navigation }) {
  return <AuthenticationContent navigation={navigation} login={false} />;
}

export default SignUpScreen;
