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
