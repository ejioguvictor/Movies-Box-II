import { useState, useEffect } from "react";

import apiSettings, { Movie, Cast, Crew } from "../API";

//helpers
import { isPersistedState } from "../helpers";

//types
export type MovieState = Movie & { actors: Cast[]; directors: Crew[] };

const useMovieFetch = (movieId: number) => {
  const [state, setState] = useState<MovieState>({} as MovieState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(false);

        const movie = await apiSettings.fetchMovie(movieId);
        const credits = await apiSettings.fetchCredits(movieId);

        //Get directors
        const directors = credits.crew.filter(
          (member) => member.job === "Director"
        );

        setState({
          ...movie,
          actors: credits.cast,
          directors,
        });
        setLoading(false);
      } catch (error) {
        setError(true);
      }
    };

    const sessionState = isPersistedState(movieId.toString());
    if (sessionState) {
      setState(sessionState);
      setLoading(false);
      return;
    }

    fetchMovie();
  }, [movieId]);

  //wriring to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(movieId.toString(), JSON.stringify(state));
  }, [movieId, state]);

  return { state, loading, error };
};

export default useMovieFetch;
