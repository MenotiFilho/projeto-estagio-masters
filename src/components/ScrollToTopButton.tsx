import { CaretUp } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisibility = () => {
		if (window.pageYOffset > 300) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		window.addEventListener('scroll', toggleVisibility);
		return () => {
			window.removeEventListener('scroll', toggleVisibility);
		};
	}, []);

	return (
		<button
			onClick={scrollToTop}
			className={`fixed bottom-4 rounded-full bg-blue-950/80 text-white transition-opacity ml-2 p-2 ${
				isVisible ? 'opacity-100' : 'opacity-0'
			}`}
		>
			<CaretUp size={32} color="white" weight="regular" />
		</button>
	);
};

export default ScrollToTopButton;
