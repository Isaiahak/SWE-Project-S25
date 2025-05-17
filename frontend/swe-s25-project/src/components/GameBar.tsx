import MiniGame from "./MiniGame";
import { useContext } from "react";
import { gameContext } from "../hooks/useGameContext.tsx";

export default function GameBar() {

  const games = [
    { icon: "startled.svg", id: 1 },
    { icon: "race.svg", id: 2 },
    { icon: "ufo.svg", id: 3 },
    { icon: "unicorn.svg", id: 4 },
    { icon: "thinking.svg", id: 5 },
  ];

  return (
    <div className="m-6 p-4 flex items-center rounded-2xl bg-light-blue-100 h-38 inset-shadow-sm">
      {games.map(({ icon, id }) => (
        <MiniGame icon={icon} game={id} />
      ))}
    </div>
  );
}
