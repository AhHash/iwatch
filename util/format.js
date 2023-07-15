export const title = (str) => {
  if (!str) return;
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const getImgUri = (img) => {
  return typeof img == "number" ? img : { uri: img };
};

export const limitString = (text, limit) => {
  return text.length >= limit ? text.slice(0, limit) + "..." : text;
};
