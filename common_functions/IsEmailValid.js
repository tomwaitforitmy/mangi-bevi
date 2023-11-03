export const IsEmailValid = (email) => {
  if (hasWhiteSpace(email)) {
    return false;
  }

  return email.includes("@") && email.includes(".");
};

export const INVALID_EMAIL_ERROR = "Invalid email.";

function hasWhiteSpace(s) {
  return /\s/g.test(s);
}
