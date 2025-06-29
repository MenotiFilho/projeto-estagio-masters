import React, { useState, useEffect, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { auth, db } from './firebase';
import { collection, doc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';  // Certifique-se de importar tudo que precisar

type Game = {
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  genre: string;
  favorite: boolean;
  rating: number;
};

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');
  const [isFavoriteActive, setIsFavoriteActive] = useState(false);
  const [isAscending, setIsAscending] = useState(false);

  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  const fetchData = async () => {
    try {
      const headers = { 'dev-email-address': 'menotimfilho@gmail.com' };

      const response = await axios.get(
        'https://games-test-api-81e9fb0d564a.herokuapp.com/api/data',
        { headers, timeout: 5000 }
      );

      const gamesFetched = response.data.map((game: Game) => ({
        ...game,
        favorite: false,
        rating: 0,
      }));

      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        await Promise.all(
          gamesFetched.map(async (game) => {
            const gameRef = doc(collection(db, 'users', userId, 'games'), String(game.id));
            const gameDoc = await getDoc(gameRef);
            if (gameDoc.exists()) {
              const gameData = gameDoc.data();
              game.favorite = gameData.favorite || false;
              game.rating = gameData.rating || 0;
            }
          })
        );
      }

      setGames(gamesFetched);
      setLoading(false);
    } catch (error) {
      if ((error as AxiosError).code === 'ECONNABORTED') {
        showToast('O servidor demorou para responder, tente mais tarde');
      } else if (
        axios.isAxiosError(error) &&
        error.response &&
        [500, 502, 503, 504, 507, 508, 509].includes(error.response.status)
      ) {
        showToast('O servidor falhou em responder, tente recarregar a página');
      } else {
        showToast('O servidor não conseguiu responder por agora, tente novamente mais tarde');
      }
      setLoading(false);
    }
  };

  const showToast = (message: string) => {
    setError(message);
    // Exiba o toast conforme seu código
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtro aplicado dinamicamente com useMemo
  const filtered = useMemo(() => {
    let result = [...games];

    if (selectedGenre && selectedGenre !== 'Todos') {
      result = result.filter((game: Game) => game.genre === selectedGenre);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((game: Game) => game.title.toLowerCase().includes(term));
    }
    return result;
  }, [games, selectedGenre, searchTerm]);

  // Atualiza os jogos filtrados com ou sem favoritos
  useEffect(() => {
    const applyFilter = async () => {
      if (isFavoriteActive && auth.currentUser) {
        const userId = auth.currentUser.uid;
        const favoritesQuery = query(
          collection(db, 'users', userId, 'games'),
          where('favorite', '==', true)
        );
        const favoritesSnapshot = await getDocs(favoritesQuery);
        const favoriteIds = favoritesSnapshot.docs.map((doc) => doc.id);

        const favoritesFiltered = filtered.filter((game: Game) =>
          favoriteIds.includes(String(game.id))
        );
        setFilteredGames(favoritesFiltered);
      } else {
        setFilteredGames(filtered);
      }
    };
    applyFilter();
  }, [filtered, isFavoriteActive]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  const handleFavoriteChange = () => {
    setIsFavoriteActive((prev) => !prev);
  };

  const handleSortClick = () => {
    setIsAscending((prev) => !prev);
  };

  return (
    <div>
      {/* Seu código de UI */}
    </div>
  );
};

export default App;