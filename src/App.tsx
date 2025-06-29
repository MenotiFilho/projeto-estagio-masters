import React, { useState, useEffect, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { auth, db } from './firebase';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';

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

  // Função para buscar os dados da API
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

  // Efeito para buscar os dados quando o componente é montado
  useEffect(() => {
    fetchData();
  }, []);

  // Função de filtro para os jogos
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

  // Aplicar o filtro para jogos favoritos, se ativo
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
    <div className="App">
      <div className="filters">
        {/* Filtro de pesquisa */}
        <input
          type="text"
          placeholder="Buscar jogos"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {/* Filtro de gênero */}
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="Todos">Todos</option>
          {/* Adicione outros gêneros conforme necessário */}
          <option value="Ação">Ação</option>
          <option value="RPG">RPG</option>
          <option value="Aventura">Aventura</option>
        </select>

        {/* Filtro de favoritos */}
        <label>
          Mostrar apenas favoritos
          <input
            type="checkbox"
            checked={isFavoriteActive}
            onChange={() => setIsFavoriteActive(!isFavoriteActive)}
          />
        </label>
      </div>

      <div className="games-list">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <div key={game.id} className="game-card">
              <img src={game.thumbnail} alt={game.title} />
              <h3>{game.title}</h3>
              <p>{game.short_description}</p>
              <p>Gênero: {game.genre}</p>
              <p>Avaliação: {game.rating}</p>
              <button onClick={() => alert(`Favoritar o jogo ${game.title}`)}>
                {game.favorite ? 'Desfavoritar' : 'Favoritar'}
              </button>
            </div>
          ))
        ) : (
          <p>Nenhum jogo encontrado</p>
        )}
      </div>
    </div>
  );
};

export default App;