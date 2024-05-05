export const PrepareSelectedFriends = (candidates, friends) => {
  //create a local copy to not modify state (deep clone array of objects)
  const localCandidates = candidates.map((u) => ({ ...u }));
  //reset everything that might have been selected
  localCandidates.forEach((user) => {
    user.isSelected = false;
  });
  //mark the friends
  if (friends) {
    friends.map((id) => {
      localCandidates.find((u) => u.id === id).isSelected = true;
    });
  }

  return localCandidates;
};
