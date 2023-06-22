import React from 'react';
import GameCard from './GameCard';

type Game = {
	id: number;
	title: string;
	thumbnail: string;
	short_description: string;
	genre: string;
};

type GameGridProps = {
	games: Game[];
};

const GameGrid: React.FC<GameGridProps> = ({ games }) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 content-center max-w-7xl">
			{games.map((game) => (
				<GameCard key={game.id} game={game} />
			))}
		</div>
	);
};

export default GameGrid;
