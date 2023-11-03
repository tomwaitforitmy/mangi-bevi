export const IsEmailValid = (email) => {
  return email.includes("@") && email.includes(".");
};
