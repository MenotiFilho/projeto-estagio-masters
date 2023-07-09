import React, { useState } from 'react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';

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
	const [isAscending, setIsAscending] = useState(true);

	const handleSortClick = () => {
		setIsAscending(!isAscending);
	};

	const genres = [
		'Todos',
		...Array.from(new Set(games.map((game) => game.genre))),
	];

	const handleGenreChange = (genre: string) => {
		onGenreChange(genre);
	};

	const handleFavoriteChange = () => {
		return null;
	};

	return (
		<div className="flex flex-col gap-2">
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
			<div className="flex gap-1">
				<button
					className="bg-[#1E293B] rounded-md px-3 py-1 h-fit text-lg flex items-center justify-center  "
					onClick={handleFavoriteChange}
				>
					Favoritos
				</button>

				<button
					className="bg-[#1E293B] rounded-md px-3 py-1 h-fit text-lg flex items-center justify-center  "
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
		</div>
	);
};

export default GenreFilter;
