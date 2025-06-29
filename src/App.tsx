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
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');
  const [isFavoriteActive, setIsFavoriteActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
    } catch (error) {
      if ((error as AxiosError).code === 'ECONNABORTED') {
        console.log('O servidor demorou para responder, tente mais tarde');
      } else {
        console.log('O servidor não conseguiu responder por agora, tente novamente mais tarde');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  return (
    <div>
      {/* Seu código de UI */}
    </div>
  );
};

export default App;