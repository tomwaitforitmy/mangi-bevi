export const PrepareSelectedFriends = (candidates, friends) => {
  // reset everything that might have been selected
  console.log("### reset users");
  candidates.forEach((user) => {
    user.isSelected = false;
  });

  if (friends) {
    friends.map((id) => {
      candidates.find((u) => u.id === id).isSelected = true;
    });
  }
};
