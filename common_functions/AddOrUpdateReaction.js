export function AddOrUpdateReaction(reactions, newReaction) {
  //Remove the user, if the value is empty
  if (newReaction.emoji === "") {
    return reactions.filter((r) => r.authorId !== newReaction.authorId);
  }
  const userHasReaction = reactions.find(
    (r) => r.authorId === newReaction.authorId,
  );
  if (userHasReaction) {
    userHasReaction.emoji = newReaction.emoji;
  } else {
    reactions.push(newReaction);
  }

  return reactions;
}
