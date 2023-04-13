export const PrepareSelectedLinks = (candidates, links) => {
  if (links) {
    links.map((id) => {
      candidates.find((m) => m.id === id).isSelected = true;
    });
  }
};
