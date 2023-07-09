import React from 'react';

type SearchBarProps = {
	searchTerm: string;
	onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
	searchTerm,
	onSearchChange,
}) => {
	return (
		<div className="w-full flex justify-center mt-5">
			<input
				id="searchBar"
				className="bg-[#1E293B] w-full lg:w-2/3 rounded-lg px-2"
				type="text"
				value={searchTerm}
				onChange={onSearchChange}
				placeholder="Buscar por título"
			/>
		</div>
	);
};

export default SearchBar;
