import GameBar from "./GameBar";
import useGameContext from "../hooks/useGameContext.tsx";

function GameUI({ title }) {
  return (
    <div className="flex flex-col w-full items-center justify-between">
      <h1
        className="border-black text-secondary text-[6rem] font-[MuseoModerno] font-bold text-shadow-md"
      >
        {title}
      </h1>
      <img
        className="h-120 w-[65vw] bg-secondary rounded-2xl p-4"
        src="globe.svg"
        alt="placeholder"
      />
      <GameBar />
    </div>
  );
}

export default function MainUI() {
  const { game } = useGameContext()

  const gameProperties: Record<number, { title: string }> = {
    1: { title: "Game of Nodes" },
    2: { title: "Risky Regression" },
    3: { title: "Gradient Descent Dash" },
    4: { title: "KNN Katastrophe" },
    5: { title: "Random Forest" },
  };

  const selectedGame = gameProperties[game]

  return selectedGame ? <GameUI title={selectedGame.title} /> : null
}