import React from "react";
import AuthenticationContent from "../components/AuthenticationContent";

function SignUpScreen() {
  return <AuthenticationContent login={false} passwordReset={false} />;
}

export default SignUpScreen;
