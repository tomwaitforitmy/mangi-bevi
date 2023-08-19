export const GetFriends = (userId, users) => {
  const user = users.find((u) => u.id === userId);
  return user.friends;
};
