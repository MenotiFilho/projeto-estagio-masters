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
  rating: number;
};

type GameCardProps = {
  game: Game;
};

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const [favorite, setFavorite] = useState(game.favorite);
  const [rating, setRating] = useState(game.rating);

  const { toast } = useToast();

  useEffect(() => {
    setFavorite(game.favorite);
    setRating(game.rating);
  }, [game.favorite, game.rating]);

  const handleFavoriteClick = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: 'Faça o login',
        description: 'Faça o login para poder favoritar os jogos.',
        duration: 3000,
      });
      return;
    }

    try {
      const gameRef = doc(collection(db, 'users', user.uid, 'games'), String(game.id));
      await setDoc(gameRef, {
        name: game.title,
        favorite: !favorite,
        rating: rating,
      });
      setFavorite(!favorite);
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    }
  };

  const handleRatingClick = async (selectedRating: number) => {
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: 'Faça o login',
        description: 'Faça o login para poder avaliar os jogos.',
        duration: 3000,
      });
      return;
    }

    try {
      const gameRef = doc(collection(db, 'users', user.uid, 'games'), String(game.id));
      await setDoc(gameRef, {
        name: game.title,
        favorite: favorite,
        rating: selectedRating,
      });
      setRating(selectedRating);
    } catch (error) {
      console.error('Erro ao atualizar nota:', error);
    }
  };

  return (
    <div className="game-card bg-[#1E293B] rounded-lg p-4 pb-2 flex flex-col justify-between items-center w-full">
      <div className="flex flex-col">
        <img className="w-auto mb-4 rounded" src={game.thumbnail} alt={game.title} />
        <h3 className="text-lg font-bold">{game.title}</h3>
        <p className="text-sm mb-2 text-white/60">{game.short_description}</p>
      </div>
      <div className="flex flex-col justify-self-end mt-5 w-full">
        <div className="flex justify-between w-full">
          <button
            className={`text-gray-500 transition ease-in-out hover:text-red-500 hover:scale-125 ${favorite ? 'text-red-500' : ''}`}
            onClick={handleFavoriteClick}
          >
            {favorite ? <Heart size={22} color="red" weight="fill" /> : <Heart size={22} />}
          </button>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                className={`text-gray-500 transition ease-in-out hover:text-yellow-500 hover:scale-125 ${i <= rating ? 'text-yellow-500' : ''}`}
                onClick={() => handleRatingClick(i)}
              >
                {i <= rating ? <Star size={22} weight="fill" /> : <Star size={22} />}
              </button>
            ))}
          </div>
        </div>
        <p className="text-slate-400/50 text-xs self-center mt-5">Genre: {game.genre}</p>
      </div>
    </div>
  );
};

export default GameCard;