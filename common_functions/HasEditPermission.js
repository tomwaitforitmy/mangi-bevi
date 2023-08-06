export const HasEditPermission = (user, authorId, authorFriends) => {
  if (user === undefined) {
    console.error("User is undefined in HasEditPermission()! Data corruption?");
  }
  if (authorId === undefined) {
    console.error(
      "AuthorId is undefined in HasEditPermission()! Data corruption?",
    );
  }

  if (authorId === user.id) {
    return true;
  }

  if (authorFriends && authorFriends.includes(user.id)) {
    return true;
  }

  return false;
};
