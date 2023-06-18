export const SplitTextToHighlight = (text, searchTerm) => {
  if (!searchTerm) {
    return [text];
  }
  //This is protection against corrupt data:
  //In rare cases, there have been arrays inside the array.
  //We have to destructure that here with flat:
  //[[[]]].flat(Infinity) -> []
  //Afterwards, we have to get out string:
  //[tmpText] = ["Some text"] -> tmpText = "Some text"
  if (Array.isArray(text)) {
    const [tmpText] = text.flat(Infinity);
    text = tmpText;
  }
  if (!text) {
    return [];
  }

  //escape all special characters, so users can search for ?,. etc.
  const regEscape = (v) => v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

  //new RegExp(..., "i") makes split to match case insensitive
  // "(" ")" will take case that the matches are included in the array
  //filter(Boolean) removes empty "" elements that are added where it matches
  return text
    .split(new RegExp("(" + regEscape(searchTerm) + ")", "i"))
    .filter(Boolean);
};
