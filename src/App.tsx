import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import SearchBar from './components/SearchBar';
import GameGrid from './components/GameGrid';
import GenreFilter from './components/GenreFilter';
import { Oval } from 'react-loader-spinner';
import NavBar from './components/NavBar';
import { Toaster } from './components/ui/toaster';
import { auth, db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

type Game = {
	id: number;
	title: string;
	thumbnail: string;
	short_description: string;
	genre: string;
};

const App: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [games, setGames] = useState<Game[]>([]);
	const [filteredGames, setFilteredGames] = useState<Game[]>([]);
	const [error, setError] = useState<string | undefined>(undefined);

	const [searchTerm, setSearchTerm] = useState<string>('');
	const [selectedGenre, setSelectedGenre] = useState<string>('');

	useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			try {
				const headers = {
					'dev-email-address': 'menotimfilho@gmail.com',
				};

				const response = await axios.get(
					'https://games-test-api-81e9fb0d564a.herokuapp.com/api/data',
					{
						headers: headers,
						timeout: 5000,
					}
				);

				if (isMounted) {
					setGames(response.data);
					setLoading(false);
				}
			} catch (error) {
				if ((error as AxiosError).code === 'ECONNABORTED') {
					setError('O servidor demorou para responder, tente mais tarde');
				} else if (
					error.response &&
					[500, 502, 503, 504, 507, 508, 509].includes(error.response.status)
				) {
					setError('O servidor falhou em responder, tente recarregar a página');
				} else {
					setError(
						'O servidor não conseguiu responder por agora, tente novamente mais tarde'
					);
				}
				setLoading(false);
			}
		};

		fetchData();

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		let filteredGames = games;

		if (selectedGenre && selectedGenre !== 'Todos') {
			filteredGames = filteredGames.filter(
				(game) => game.genre === selectedGenre
			);
		}

		if (searchTerm) {
			const searchTermLowerCase = searchTerm.toLowerCase();
			filteredGames = filteredGames.filter((game) =>
				game.title.toLowerCase().includes(searchTermLowerCase)
			);
		}

		setFilteredGames(filteredGames);
	}, [games, selectedGenre, searchTerm]);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const handleGenreChange = (genre: string) => {
		setSelectedGenre(genre);
	};

	useEffect(() => {
		const loadUserFavoritesAndRatings = async () => {
			const user = auth.currentUser;
			if (user) {
				try {
					// Carrega os favoritos do usuário
					const favoritesQuery = query(
						collection(db, 'users', user.uid, 'favorites')
					);
					const favoritesSnapshot = await getDocs(favoritesQuery);
					const userFavorites = favoritesSnapshot.docs.map((doc) => doc.data());

					// Carrega as notas do usuário
					const ratingsQuery = query(
						collection(db, 'games'),
						where(user.uid, '==', true)
					);
					const ratingsSnapshot = await getDocs(ratingsQuery);
					const userRatings = ratingsSnapshot.docs.map((doc) => doc.data());

					// Utilize as informações de favoritos e notas como desejar
					console.log('Favoritos do usuário:', userFavorites);
					console.log('Notas do usuário:', userRatings);
				} catch (error) {
					console.error(
						'Erro ao carregar favoritos e notas do usuário:',
						error
					);
				}
			}
		};

		// Chama a função ao fazer login
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				loadUserFavoritesAndRatings();
			}
		});

		return () => unsubscribe();
	}, []);

	return (
		<div className="bg-[#0F172A] text-[#e2e8f0]  mb-4 mx-2 flex flex-col justify-center content-center ">
			<NavBar />
			{loading ? (
				<div className="w-screen h-screen flex items-center justify-center">
					<Oval
						height={80}
						width={80}
						color="#1E293B"
						wrapperStyle={{}}
						wrapperClass=""
						visible={true}
						ariaLabel="oval-loading"
						secondaryColor="#2f415"
						strokeWidth={2}
						strokeWidthSecondary={2}
					/>
				</div>
			) : error ? (
				<div className="flex items-center justify-center">{error}</div>
			) : (
				<div className="flex flex-col max-w-7xl gap-5 justify-center items-center mx-auto">
					<SearchBar
						searchTerm={searchTerm}
						onSearchChange={handleSearchChange}
					/>
					<GenreFilter
						selectedGenre={selectedGenre}
						onGenreChange={handleGenreChange}
						games={games}
					/>
					<GameGrid games={filteredGames} />
				</div>
			)}
			<Toaster />
		</div>
	);
};

export default App;
