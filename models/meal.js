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
    this.isSelected = false;
  }
}

export default Meal;
