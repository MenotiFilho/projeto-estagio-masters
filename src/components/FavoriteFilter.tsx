import { useState } from 'react';

function FavoriteFilter(onFavSelect) {
	const [isFavoriteActive, setIsFavoriteActive] = useState(false);

	const handleFavoriteChange = () => {
		setIsFavoriteActive(!isFavoriteActive);
		onFavSelect(!isFavoriteActive);
	};

	return (
		<div>
			{isFavoriteActive ? (
				<button
					className="bg-blue-500 rounded-md px-3 py-1 h-fit text-lg flex items-center justify-center"
					onClick={handleFavoriteChange}
				>
					Favoritos
				</button>
			) : (
				<button
					className="bg-[#1E293B] rounded-md px-3 py-1 h-fit text-lg flex items-center justify-center"
					onClick={handleFavoriteChange}
				>
					Favoritos
				</button>
			)}
		</div>
	);
}

export default FavoriteFilter;
