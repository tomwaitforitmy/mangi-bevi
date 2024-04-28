const User = (
  id,
  name,
  email,
  meals,
  firebaseId,
  friends,
  expoPushToken,
  settings,
) => ({
  id,
  name,
  email,
  meals: meals ? meals : [],
  firebaseId,
  friends: friends ? friends : [],
  isSelected: false,
  expoPushToken,
  settings: settings ? settings : [],
});

export default User;
