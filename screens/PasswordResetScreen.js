import React from "react";
import AuthenticationContent from "../components/AuthenticationContent";

function PasswordResetScreen() {
  return <AuthenticationContent login={false} passwordReset={true} />;
}
export default PasswordResetScreen;
