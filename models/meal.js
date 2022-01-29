class Meal {
  constructor(
    title,
    id,
    primaryImageUrl,
    ingredients,
    steps,
    imageUrls,
    tags,
    rating
  ) {
    this.title = title;
    this.id = id;
    this.primaryImageUrl = primaryImageUrl;
    this.ingredients = ingredients;
    this.steps = steps;
    this.imageUrls = imageUrls;
    this.tags = tags;
    this.rating = rating;
  }
}

export default Meal;
