import GameBar from "./GameBar";
import useGameContext from "../hooks/useGameContext.tsx";

function GameUI({ title, imageUrl }) {
  return (
    <div className="flex flex-col w-full items-center justify-between">
      <h1
        className="border-black text-secondary text-[6rem] font-[MuseoModerno] font-bold text-shadow-md"
      >
        {title}
      </h1>
      <img
        className="h-120 w-[65vw] bg-secondary rounded-2xl p-4"
        src={imageUrl}
        alt="placeholder"
      />
      <GameBar />
    </div>
  );
}

export default function MainUI() {
  const { game } = useGameContext()

  const gameProperties: Record<number, { title: string, imageUrl: string }> = {
    1: { title: "Game of Nodes", imageUrl: "globe.svg" },
    2: { title: "Risky Regression", imageUrl: "mind_map.svg" },
    3: { title: "Gradient Descent Dash", imageUrl: "vcs.svg" },
    4: { title: "KNN Katastrophe", imageUrl: "space.svg" },
    5: { title: "Random Forest", imageUrl: "forest.svg" },
  };

  const selectedGame = gameProperties[game]

  return selectedGame ? <GameUI title={selectedGame.title} imageUrl={selectedGame.imageUrl} /> : null
}