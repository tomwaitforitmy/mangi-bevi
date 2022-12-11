class UserStats {
  constructor(
    userId,
    countTags,
    countSteps,
    countIngredients,
    experiencedUser,
  ) {
    this.userId = userId;
    this.countTags = countTags;
    this.countSteps = countSteps;
    this.countIngredients = countIngredients;
    this.experiencedUser = experiencedUser;
  }
}

export default UserStats;
