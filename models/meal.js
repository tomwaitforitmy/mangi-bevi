class Meal {
  constructor(
    title,
    id,
    primaryImageUrl,
    ingredients,
    steps,
    imageUrls,
    tags,
    rating,
    authorId,
    creationDate,
    editorId,
    editDate,
    links,
    isTestMangi,
  ) {
    this.title = title;
    this.id = id;
    this.primaryImageUrl = primaryImageUrl;
    this.ingredients = ingredients;
    this.steps = steps;
    this.imageUrls = imageUrls;
    this.tags = tags;
    this.rating = rating;
    this.authorId = authorId;
    this.creationDate = creationDate;
    this.editorId = editorId;
    this.editDate = editDate;
    this.links = links ? links : [];
    this.isSelected = false;
    this.isTestMangi = isTestMangi ? isTestMangi : false;
  }
}

export default Meal;
