import axios from "axios";

export const fetchCommitments = async (query) => {
  if (!query) {
    return;
  }

  const url = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=1`;

  const response = await axios.get(
    url,
    (options = {
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YjI5OWM0MmYzYmIyYTVhNzQwNWFhNWQ1NzBhMzRkZCIsInN1YiI6IjY0YWY5Y2Q1ZTI0YjkzNWIyZTVhYzExNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KRMB90EvOJyl5RPnAb7iRu2S-TDD-GgC0cd8ogrd5GA",
      },
    })
  );

  return response.data;
};

export const getSeriesDetails = async (id) => {
  if (!id) {
    return;
  }

  const url = `https://api.themoviedb.org/3/tv/${id}?language=en-US`;

  const response = await axios.get(
    url,
    (options = {
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YjI5OWM0MmYzYmIyYTVhNzQwNWFhNWQ1NzBhMzRkZCIsInN1YiI6IjY0YWY5Y2Q1ZTI0YjkzNWIyZTVhYzExNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KRMB90EvOJyl5RPnAb7iRu2S-TDD-GgC0cd8ogrd5GA",
      },
    })
  );

  return response.data;
};
