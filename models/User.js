class User {
  constructor(id, name, email, meals, firebaseId, friends) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.meals = meals;
    this.firebaseId = firebaseId;
    this.friends = friends;
  }
}

export default User;
