import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { useState } from 'react';

function Ascend() {
	const [isAscending, setIsAscending] = useState(true);

	const handleSortClick = () => {
		setIsAscending(!isAscending);
	};

	return (
		<div>
			<div className="flex gap-1">
				<button
					className="bg-[#1E293B] rounded-md px-3 py-1 h-fit text-lg flex items-center justify-center"
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
}

export default Ascend;
