import LobbyButton from "../components/LobbyButton";
import Player from "../components/Player";

export default function LobbyPage() {
  return (
    <>
      {/* Top Section */}
      <div className="p-4 gap-12 h-[60vh] w-full bg-primary flex flex-col">
        <div className="flex justify-between">
          <Player avatar="/icons/anaconda.png" nickname="MrSnake"/>
          <Player avatar="/icons/blackbird.png" nickname="SR71"/>
          <Player avatar="/icons/cow.png" nickname="MatadorKiller123"/>
          <Player avatar="/icons/ganesha.png" nickname="JAW3D"/>
        </div>
        <div className="flex justify-between">
          <Player avatar="/icons/jaguar.png" nickname="MovesLikeJaguar"/>
          <Player avatar="/icons/panda-bear.png" nickname="XxDragonWarriorxX"/>
          <Player avatar="/icons/turtle.png" nickname="Raphael"/>
          <Player avatar="/icons/bear.png" nickname="Carmy"/>
        </div>
      </div>
      {/* Bottom Section */}
      <div className="h-[40vh] w-full bg-tertiary flex justify-evenly items-center">
        <LobbyButton
          label="CHANGE NICKNAME"
          height="h-20"
          width="w-50"
          fontSize="text-[1rem]"
        />
        <LobbyButton
          label="CHANGE AVATAR"
          height="h-20"
          width="w-50"
          fontSize="text-[1rem]"
        />
        <LobbyButton
          label="START"
          height="h-40"
          width="w-100"
          fontSize="text-[5rem]"
        />
      </div>
    </>
  );
}
