import { useState, useEffect } from "react";
import apiSettings, { Movie } from "../API";
//helpers
import { isPersistedState } from "../helpers";

const initialState = {
  page: 0,
  results: [] as Movie[],
  total_pages: 0,
  total_results: 0,
};

export const useHomeFetch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchMovies = async (page: number, searchTerm = "") => {
    try {
      setError(false);
      setIsLoading(true);

      const movies = await apiSettings.fetchMovies(searchTerm, page);

      setState((prev) => ({
        ...movies,
        results:
          page > 1 ? [...prev.results, ...movies.results] : [...movies.results],
      }));
    } catch (error) {
      setError(true);
    }
    setIsLoading(false);
  };

  //initial rendering and search
  useEffect(() => {
    if (!searchTerm) {
      const sessionState = isPersistedState("homeState");

      if (sessionState) {
        console.log("Fetching data from sessionStorage");
        setState(sessionState);
        return;
      }
    }

    console.log("Fetching from API");
    setState(initialState);
    fetchMovies(1, searchTerm);
  }, [searchTerm]);

  //Load More
  useEffect(() => {
    if (!isLoadingMore) return;

    fetchMovies(state.page + 1, searchTerm);
    setIsLoadingMore(false); //this will take the loading more function to its preset state.
  }, [isLoadingMore, searchTerm, state.page]);

  //writing to sessionStorage
  useEffect(() => {
    if (!searchTerm) sessionStorage.setItem("homeState", JSON.stringify(state));
  }, [searchTerm, state]);

  return {
    state,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    setIsLoadingMore,
  };
};
