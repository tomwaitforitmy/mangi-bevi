export function CountCooks(cookedByUser) {
  const result = [];
  if (!cookedByUser) {
    return result;
  }
  cookedByUser.map((e) => {
    const alreadyThereIndex = result.findIndex((c) => c.userId === e.userId);
    if (alreadyThereIndex !== -1) {
      result[alreadyThereIndex].amount += 1;
    } else {
      result.push({ userId: e.userId, amount: 1 });
    }
  });

  result.sort((a, b) => (a.amount <= b.amount ? 1 : -1));

  return result;
}
