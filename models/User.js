class User {
  constructor(id, name, email, meals, firebaseId, friends, expoPushToken) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.meals = meals;
    this.firebaseId = firebaseId;
    this.friends = friends;
    this.isSelected = false;
    this.expoPushToken = expoPushToken;
  }
}

export default User;
