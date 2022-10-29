export const GetReward = (value, rewards) => {
  const indexNext = rewards.findIndex((r) => r.threshold > value);
  return rewards[indexNext - 1];
};

export const GetNextReward = (value, rewards) => {
  return rewards.find((r) => r.threshold > value);
};
