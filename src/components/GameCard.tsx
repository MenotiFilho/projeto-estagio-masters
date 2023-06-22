import React from 'react';

type Game = {
	id: number;
	title: string;
	thumbnail: string;
	short_description: string;
	genre: string;
};

type GameCardProps = {
	game: Game;
};

const GameCard: React.FC<GameCardProps> = ({ game }) => {
	return (
		<div className="game-card bg-[#1E293B] shadow-lg shadow-[#121924] rounded-lg p-4 flex flex-col justify-between items-center w-full">
			<div className=" flex flex-col">
				<img
					className="w-auto mb-4 rounded"
					src={game.thumbnail}
					alt={game.title}
				/>
				<h3 className="text-lg font-bold ">{game.title}</h3>
				<p className="text-sm mb-2">{game.short_description}</p>
			</div>
			<p className="text-slate-400 text-xs justify-self-end">
				Genre: {game.genre}
			</p>
		</div>
	);
};

export default GameCard;
