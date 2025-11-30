const User = (
  id,
  name,
  email,
  meals,
  firebaseId,
  friends,
  expoPushToken,
  settings,
  favorites,
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
  favorites: favorites ? favorites : [],
});

export default User;
