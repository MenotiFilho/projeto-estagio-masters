import React, { useEffect, useState } from 'react';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { Heart, Star } from '@phosphor-icons/react';
import { useToast } from './ui/use-toast';
import { onAuthStateChanged } from 'firebase/auth';

type Game = {
	id: number;
	title: string;
	thumbnail: string;
	short_description: string;
	genre: string;
	favorite: boolean;
};

type GameCardProps = {
	game: Game;
};

const GameCard: React.FC<GameCardProps> = ({ game }) => {
	const [favorite, setFavorite] = useState(false);
	const [rating, setRating] = useState(0);

	const { toast } = useToast();

	useEffect(() => {
		const fetchFavoriteData = async () => {
			const user = auth.currentUser;
			if (user) {
				try {
					const favoriteRef = doc(
						collection(db, 'users', user.uid, 'favorites'),
						String(game.title)
					);
					const favoriteDoc = await getDoc(favoriteRef);
					if (favoriteDoc.exists()) {
						const favoriteData = favoriteDoc.data();
						setFavorite(favoriteData.favorite);
					}
				} catch (error) {
					console.error('Error fetching favorite data:', error);
				}
			}
		};

		const fetchRatingData = async () => {
			const user = auth.currentUser;
			if (user) {
				try {
					const ratingRef = doc(
						collection(db, 'games', String(game.title), 'ratings'),
						user.uid
					);
					const ratingDoc = await getDoc(ratingRef);
					if (ratingDoc.exists()) {
						const ratingData = ratingDoc.data();
						setRating(ratingData.rating);
					}
				} catch (error) {
					console.error('Error fetching rating data:', error);
				}
			}
		};

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				fetchFavoriteData();
				fetchRatingData();
			} else {
				setFavorite(false);
				setRating(0);
			}
		});

		return () => unsubscribe();
	}, [game]);

	const handleFavoriteClick = async () => {
		const user = auth.currentUser;
		if (user) {
			try {
				const favoriteRef = doc(
					collection(db, 'users', user.uid, 'favorites'),
					String(game.title)
				);
				if (favorite) {
					await setDoc(favoriteRef, {
						name: game.title,
						favorite: false,
					});
				} else {
					await setDoc(favoriteRef, {
						name: game.title,
						favorite: true,
					});
				}
				setFavorite(!favorite);
			} catch (error) {
				console.error('Error adding/removing favorite:', error);
			}
		}
		if (!user) {
			toast({
				title: 'Faça o login',
				description: 'Faça o login para poder favoritar os jogos.',
				duration: 3000,
			});
		}
	};

	const handleRatingClick = async (selectedRating: number) => {
		const user = auth.currentUser;
		if (user) {
			try {
				const ratingRef = doc(
					collection(db, 'games', String(game.title), 'ratings'),
					user.uid
				);
				await setDoc(ratingRef, {
					name: game.title,
					rating: selectedRating,
				});
				setRating(selectedRating);
			} catch (error) {
				console.error('Error adding game rating:', error);
			}
		}
		if (!user) {
			toast({
				title: 'Faça o login',
				description: 'Faça o login para poder avaliar os jogos.',
				duration: 3000,
			});
		}
	};

	const renderHeartIcon = () => {
		return (
			<button
				className={`text-gray-500 transition ease-in-out hover:text-red-500 hover:scale-125 ${
					favorite ? 'text-red-500' : ''
				}`}
				onClick={handleFavoriteClick}
			>
				{favorite ? (
					<Heart size={22} color="red" weight="fill" />
				) : (
					<Heart size={22} />
				)}
			</button>
		);
	};

	const renderRatingStars = () => {
		const stars = [];
		for (let i = 1; i <= 4; i++) {
			stars.push(
				<button
					key={i}
					className={`text-gray-500 transition ease-in-out hover:text-yellow-500 hover:scale-125 ${
						i <= rating ? 'text-yellow-500 ' : ''
					}`}
					onClick={() => handleRatingClick(i)}
				>
					{i <= rating ? <Star size={22} weight="fill" /> : <Star size={22} />}
				</button>
			);
		}
		return stars;
	};

	return (
		<div className="game-card bg-[#1E293B] shadow-lg shadow-[#121924] rounded-lg p-4 pb-2 flex flex-col justify-between items-center w-full">
			<div className=" flex flex-col">
				<img
					className="w-auto mb-4 rounded"
					src={game.thumbnail}
					alt={game.title}
				/>
				<h3 className="text-lg font-bold">{game.title}</h3>
				<p className="text-sm mb-2 text-white/60">{game.short_description}</p>
			</div>
			<div className="flex flex-col justify-self-end mt-5 w-full">
				<div className="flex justify-between w-full">
					<div className="flex items-center">{renderHeartIcon()}</div>
					<div className="flex items-center gap-1">{renderRatingStars()}</div>
				</div>
				<p className="text-slate-400/50 text-xs self-center mt-5">
					Genre: {game.genre}
				</p>
			</div>
		</div>
	);
};

export default GameCard;
