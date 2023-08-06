export const FastFilterUsers = (allUsers, searchTerm) => {
  if (!searchTerm) {
    return allUsers;
  }
  const lowerCaseSearch = searchTerm.toLowerCase();
  const lessUsers = allUsers.filter((u) =>
    u.name.toLowerCase().includes(lowerCaseSearch),
  );
  return lessUsers;
};
