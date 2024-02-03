class User {
  constructor(
    id,
    name,
    email,
    meals,
    firebaseId,
    friends,
    expoPushToken,
    settings,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.meals = meals;
    this.firebaseId = firebaseId;
    this.friends = friends;
    this.isSelected = false;
    this.expoPushToken = expoPushToken;
    this.settings = settings;
  }
}

export default User;
