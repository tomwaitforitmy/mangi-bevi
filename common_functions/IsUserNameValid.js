export const IsUserNameValid = (existingUsers, candidateName) => {
  if (candidateName.length > 20) {
    return false;
  }
  if (candidateName.length < 1) {
    return false;
  }
  if (candidateName.includes("@")) {
    return false;
  }
  if (UserAlreadyExists(existingUsers, candidateName)) {
    return false;
  }

  return true;
};

function UserAlreadyExists(existingUsers, candidateName) {
  const exists = existingUsers.find(
    (u) => u.toLowerCase() === candidateName.toLowerCase(),
  );
  return exists;
}

export const INVALID_USER_ERROR =
  "Max. 20 letters, @ is not allowed and names have to be unique.";
