import React from "react";
import AuthenticationContent from "../components/AuthenticationContent";

function LoginScreen() {
  return <AuthenticationContent login={true} passwordReset={false} />;
}
export default LoginScreen;
