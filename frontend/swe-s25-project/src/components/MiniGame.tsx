import useGameContext from "../hooks/useGameContext.tsx";
import { motion } from "motion/react";

export default function MiniGame({ icon, game }) {
  const { game: selectedGame, setGame } = useGameContext();

  const handleClick = () => {
    setGame(game);
  };

  const isSelected = selectedGame === game;

  return (
    <motion.img
      onClick={handleClick}
      src={icon}
      className={`w-32 h-32 m-2 bg-white rounded-2xl hover:cursor-pointer transition-shadow
        ${
          isSelected
            ? "shadow-xl shadow-indigo-500"
            : "shadow-md shadow-tertiary"
        }
      `}
      transition={{ type: "spring", bounce: 0.7 }}
      whileHover={{ scale: isSelected ? 1.0 : 1.1 }}
      whileTap={{ scale: 0.95 }}
    />
  );
}
