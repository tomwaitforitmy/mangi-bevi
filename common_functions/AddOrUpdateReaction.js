export function AddOrUpdateReaction(reactions, newReaction) {
  //Remove the user, if the value is empty
  if (newReaction.emoji === "") {
    //filter creates a copy and avoids state corruption
    return reactions.filter((r) => r.authorId !== newReaction.authorId);
  }

  //create a copy to avoid state corruption
  const newReactions = reactions.map((r) => ({ ...r }));

  const userHasReaction = newReactions.find(
    (r) => r.authorId === newReaction.authorId,
  );
  if (userHasReaction) {
    userHasReaction.emoji = newReaction.emoji;
  } else {
    newReactions.push(newReaction);
  }

  return newReactions;
}
