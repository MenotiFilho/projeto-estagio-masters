import React from 'react';

type Game = {
	id: number;
	title: string;
	thumbnail: string;
	short_description: string;
	genre: string;
};

type GenreFilterProps = {
	selectedGenre: string;
	onGenreChange: (genre: string) => void;
	games: Game[];
};

const GenreFilter: React.FC<GenreFilterProps> = ({
	selectedGenre,
	onGenreChange,
	games,
}) => {
	const genres = [
		'Todos',
		...Array.from(new Set(games.map((game) => game.genre))),
	];

	const handleGenreChange = (genre: string) => {
		onGenreChange(genre);
	};

	return (
		<div className="">
			{genres.map((genre) => (
				<button
					key={genre}
					value={genre}
					className={`${
						selectedGenre === genre
							? 'bg-blue-500 text-white'
							: 'bg-[#1E293B] text-[#e2e8f0]'
					} rounded-md px-3 py-1 h-6 w w-fit justify-self-center mr-1`}
					onClick={() => handleGenreChange(genre)}
				>
					<p className="whitespace-nowrap text-xs">{genre}</p>
				</button>
			))}
		</div>
	);
};

export default GenreFilter;
