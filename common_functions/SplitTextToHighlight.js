export const SplitTextToHighlight = (text, searchTerm) => {
  //escape all special characters, so users can search for ?,. etc.
  const regEscape = (v) => v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

  //new RegExp(..., "i") makes split to match case insensitive
  // "(" ")" will take case that the matches are included in the array
  //filter(Boolean) removes empty "" elements that are added where it matches
  return text
    .split(new RegExp("(" + regEscape(searchTerm) + ")", "i"))
    .filter(Boolean);
};
