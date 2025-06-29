import React, { useState, useEffect, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import SearchBar from './components/SearchBar';
import GameGrid from './components/GameGrid';
import GenreFilter from './components/GenreFilter';
import { Oval } from 'react-loader-spinner';
import NavBar from './components/NavBar';
import { Toaster } from './components/ui/toaster';
import { auth, db } from './firebase';
import {
	collection,
	doc,
	getDoc,
} from 'firebase/firestore';
import { Separator } from './components/ui/separator';
import { useToast } from './components/ui/use-toast';
import ScrollToTopButton from './components/ScrollToTopButton';
import { CaretDown, CaretUp } from '@phosphor-icons/react';

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

	const { toast } = useToast();

	const fetchData = async () => {
		try {
			const headers = { 'dev-email-address': 'menotimfilho@gmail.com' };

			const response = await axios.get(
				'https://games-test-api-81e9fb0d564a.herokuapp.com/api/data',
				{ headers, timeout: 5000 }
			);

			const gamesFetched = response.data.map((game: any) => ({
				...game,
				favorite: false,
				rating: 0,
			}));

			const user = auth.currentUser;
			if (user) {
				const userId = user.uid;
				await Promise.all(
					gamesFetched.map(async (game: Game) => {
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
		toast({
			title: 'Tente novamente',
			description: message,
			duration: 3000,
		});
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Filtro e ordenação centralizados no useMemo
	const filteredGames = useMemo(() => {
		let result = [...games];

		if (selectedGenre && selectedGenre !== 'Todos') {
			result = result.filter((game) => game.genre === selectedGenre);
		}

		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			result = result.filter((game) => game.title.toLowerCase().includes(term));
		}

		if (isFavoriteActive && auth.currentUser) {
			result = result.filter((game) => game.favorite);
		}

		// Ordenação
		const ratedGames = result.filter((game) => game.rating !== 0);
		const unratedGames = result.filter((game) => game.rating === 0);

		if (isAscending) {
			ratedGames.sort((a, b) => a.rating - b.rating);
			unratedGames.sort((a, b) => a.title.localeCompare(b.title));
		} else {
			ratedGames.sort((a, b) => b.rating - a.rating);
			unratedGames.sort((a, b) => a.title.localeCompare(b.title));
		}

		return [...ratedGames, ...unratedGames];
	}, [games, searchTerm, selectedGenre, isFavoriteActive, isAscending]);

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

	const handleRetryFetch = () => {
		setLoading(true);
		setError(undefined);
		fetchData();
	};

	return (
		<div className="bg-[#0F172A] text-[#e2e8f0] mb-4 mx-2 flex flex-col justify-center content-center">
			<NavBar />
			<div className="flex flex-col max-w-7xl gap-2 justify-center items-center mx-auto w-full">
				<SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
				<div className="flex flex-col w-full justify-start items-center gap-1">
					<GenreFilter
						selectedGenre={selectedGenre}
						onGenreChange={handleGenreChange}
						games={games}
					/>
					<div className="flex gap-1 justify-start items-start w-full">
						<button
							className={`rounded-md px-3 py-1 h-fit text-lg flex items-center justify-center ${
								isFavoriteActive ? 'bg-blue-500' : 'bg-[#1E293B]'
							}`}
							onClick={handleFavoriteChange}
						>
							Favoritos
						</button>
						<button
							className="bg-[#1E293B] rounded-md px-3 py-1 h-fit text-lg flex items-center justify-center"
							onClick={handleSortClick}
						>
							Ordenar por nota
							{isAscending ? (
								<CaretDown className="ml-2" size={20} weight="fill" />
							) : (
								<CaretUp className="ml-2" size={20} weight="fill" />
							)}
						</button>
					</div>
					<Separator className="my-3" />
				</div>
			</div>

			{loading ? (
				<div className="w-full flex mt-5 justify-center">
					<Oval
						height={80}
						width={80}
						color="#1E293B"
						visible={true}
						ariaLabel="oval-loading"
						secondaryColor="#2f415"
						strokeWidth={2}
						strokeWidthSecondary={2}
					/>
				</div>
			) : error ? (
				<div className="flex flex-col items-center justify-center">
					<p>{error}</p>
					<button
						onClick={handleRetryFetch}
						className="relative rounded group text-white inline-block w-fit p-1 mt-2"
					>
						<span className="absolute inset-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
						<span className="relative text-xs lg:text-base">Recarregar</span>
					</button>
				</div>
			) : (
				<div className="flex items-center justify-center">
					<GameGrid games={filteredGames} />
				</div>
			)}

			<Toaster />
			<ScrollToTopButton />
		</div>
	);
};

export default App;