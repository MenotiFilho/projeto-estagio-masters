import React from 'react';

type Game = {
	id: number;
	title: string;
	thumbnail: string;
	short_description: string;
	genre: string;
	favorite: boolean;
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
		if (selectedGenre === genre) {
			onGenreChange('Todos'); // Desmarcar o gênero
		} else {
			onGenreChange(genre);
		}
	};

	return (
		<div className="w-full">
			<div className="">
				{genres.map((genre) => (
					<button
						key={genre}
						value={genre}
						className={`${
							selectedGenre === genre
								? 'bg-blue-500 text-white'
								: 'bg-[#1E293B] text-[#e2e8f0]'
						} rounded-md px-3 py-1 h-fit w w-fit justify-self-center mr-1 mt-1`}
						onClick={() => handleGenreChange(genre)}
					>
						<p className="whitespace-nowrap">{genre}</p>
					</button>
				))}
			</div>
		</div>
	);
};

export default GenreFilter;
