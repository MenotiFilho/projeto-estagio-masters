/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import SearchBar from './components/SearchBar';
import GameGrid from './components/GameGrid';
import GenreFilter from './components/GenreFilter';
import { Oval } from 'react-loader-spinner';

type Game = {
	id: number;
	title: string;
	thumbnail: string;
	short_description: string;
	genre: string;
};

const App: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [games] = useState<Game[]>([]);
	const [filteredGames, setFilteredGames] = useState<Game[]>([]);
	const [error, setError] = useState<string | undefined>(undefined);

	const [searchTerm, setSearchTerm] = useState<string>('');
	const [selectedGenre, setSelectedGenre] = useState<string>('');

	useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			try {
				// ...
			} catch (error) {
				if (error instanceof AxiosError && error.code === 'ECONNABORTED') {
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
			filteredGames = filteredGames.filter((game) => game.genre === selectedGenre);
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

	return (
		<div className="bg-[#0F172A] text-[#e2e8f0] p-2 mx-2 flex justify-center content-center ">
			{loading ? (
				<div>
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
				<div>{error}</div>
			) : (
				<div className="flex flex-col gap-5 justify-center items-center">
					<SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
					<GenreFilter
						selectedGenre={selectedGenre}
						onGenreChange={handleGenreChange}
						games={games}
					/>
					<GameGrid games={filteredGames} />
				</div>
			)}
		</div>
	);
};

export default App;
