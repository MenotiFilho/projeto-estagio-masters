import { useEffect, useState } from 'react';

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
	const [isTouch, setIsTouch] = useState(false);

	const handleGenreChange = (genre: string) => {
		if (selectedGenre === genre) {
			onGenreChange('');
		} else {
			onGenreChange(genre);
		}
	};

	useEffect(() => {
		const checkIsTouch = () => {
			if (window.matchMedia('(pointer: coarse)').matches) {
				setIsTouch(true);
			} else {
				setIsTouch(false);
			}
		};

		checkIsTouch();

		return () => {
			// Limpeza do efeito, se necessário
		};
	}, []);

	return (
		<div className="w-full  flex overflow-x-scroll no-scrollbar sm:overflow-x-scroll">
			<div
				className={`${
					isTouch === true ? 'flex whitespace-nowrap' : ''
				} inline whitespace-normal`}
			>
				{genres.map((genre) => (
					<button
						key={genre}
						value={genre}
						className={`${
							selectedGenre === genre
								? 'bg-blue-500 text-white'
								: 'bg-[#1E293B] text-[#e2e8f0]'
						} rounded-md px-3 py-1 h-fit w-fit justify-self-center mr-1 mt-1`}
						onClick={() => handleGenreChange(genre)}
					>
						<p className="whitespace-nowrap">{genre}</p>
					</button>
				))}
			</div>
			{isTouch ? (
				<div className="bg-gradient-to-r from-transparent to-[#0F172A]/70 pointer-events-none w-20 h-10 fixed right-0 ml-auto mr-1"></div>
			) : null}
		</div>
	);
};

export default GenreFilter;
