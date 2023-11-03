export const IsUserNameValid = (existingUsers, candidateName) => {
  if (candidateName.length > 20) {
    return false;
  }
  if (candidateName.includes("@")) {
    return false;
  }
  if (existingUsers.includes(candidateName)) {
    return false;
  }

  return true;
};

export const INVALID_USER_ERROR =
  "User names have to be unique, @ is not allowed and max. 20 letters. Whitespace at start and end is not allowed.";
