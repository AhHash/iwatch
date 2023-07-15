import axios from "axios";

const customFetch = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YjI5OWM0MmYzYmIyYTVhNzQwNWFhNWQ1NzBhMzRkZCIsInN1YiI6IjY0YWY5Y2Q1ZTI0YjkzNWIyZTVhYzExNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KRMB90EvOJyl5RPnAb7iRu2S-TDD-GgC0cd8ogrd5GA",
  },
});

export const fetchCommitments = async (query) => {
  if (!query) {
    return;
  }

  const response = await customFetch.get(
    `search/multi?query=${query}&include_adult=false&language=en-US&page=1`
  );
  return response.data;
};

export const getSeriesDetails = async (id) => {
  if (!id) {
    return;
  }

  const response = await customFetch.get(
    `https://api.themoviedb.org/3/tv/${id}?language=en-US`
  );
  return response.data;
};
