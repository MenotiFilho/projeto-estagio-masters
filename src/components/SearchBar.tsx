import { MagnifyingGlass } from '@phosphor-icons/react';
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
		<div className="w-full flex justify-center mt-5 bg-[#1E293B] rounded-2xl items-center focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500/70 focus-within:border-transparent">
			<MagnifyingGlass
				className="ml-3"
				size={26}
				color="#6a1aff"
				weight="duotone"
			/>
			<input
				id="searchBar"
				className="bg-[#1E293B] ml-2 w-full rounded-2xl rounded-s-none  text-lg py-1 focus:outline-none  focus:border-transparent"
				type="text"
				value={searchTerm}
				onChange={onSearchChange}
				placeholder="Buscar por título"
			/>
		</div>
	);
};

export default SearchBar;
