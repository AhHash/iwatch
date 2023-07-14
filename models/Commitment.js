class Commitment {
  constructor(
    name,
    imgUri,
    imgLocal = 0,
    totalEpisodes = 1,
    currentEpisode = 0,
    category,
    description,
    status,
    type,
    id
  ) {
    this.id = id;
    this.name = name;
    this.imgUri = imgUri;
    this.imgLocal = imgLocal;
    this.totalEpisodes = totalEpisodes;
    this.currentEpisode = currentEpisode;
    this.category = category;
    this.description = description;
    this.status = status;
    this.type = type;
  }
}

export default Commitment;
