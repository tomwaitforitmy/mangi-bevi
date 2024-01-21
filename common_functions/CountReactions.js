export function CountReactions(reactions) {
  const result = [];
  if (!reactions) {
    return result;
  }
  reactions.map((r) => {
    const alreadyThereIndex = result.findIndex((c) => c.emoji === r.emoji);
    if (alreadyThereIndex !== -1) {
      result[alreadyThereIndex].amount += 1;
    } else {
      result.push({ emoji: r.emoji, amount: 1 });
    }
  });

  result.sort((a, b) => (a.amount <= b.amount ? 1 : -1));

  return result;
}
