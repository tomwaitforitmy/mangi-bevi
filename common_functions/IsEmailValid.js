export const IsEmailValid = (email) => {
  if (hasWhiteSpace(email)) {
    return false;
  }

  return email.includes("@") && email.includes(".");
};

function hasWhiteSpace(s) {
  return /\s/g.test(s);
}
