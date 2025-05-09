import LobbyButton from "../components/LobbyButton";
import Player from "../components/Player";
import { Link } from "react-router-dom";
import { ArrowBigLeft } from "lucide-react";
import { LeaveLobby } from '../services/LobbyServices.tsx'
import { useNavigate } from 'react-router-dom'

export default function LobbyPage() {
  const navigate = useNavigate()
  return (
    <>
      {/* Top Section */}
      <div className="p-4 gap-12 h-[60vh] w-full bg-primary flex flex-col">
        <div className="flex justify-between">
          <Player isHost={true} avatar="/icons/anaconda.png" nickname="MrSnake" />
          <Player isHost={false} avatar="/icons/blackbird.png" nickname="SR71" />
          <Player isHost={false} avatar="/icons/cow.png" nickname="MatadorKiller123" />
          <Player isHost={false} avatar="/icons/ganesha.png" nickname="JAW3D" />
        </div>
        <div className="flex justify-between">
          <Player isHost={false} avatar="/icons/jaguar.png" nickname="MovesLikeJaguar" />
          <Player isHost={false} avatar="/icons/panda-bear.png" nickname="XxDragonWarriorxX" />
          <Player isHost={false} avatar="/icons/turtle.png" nickname="Raphael" />
          <Player isHost={false} avatar="/icons/bear.png" nickname="Carmy" />
        </div>
      </div>
      {/* Bottom Section */}
      <div className="h-[40vh] w-full bg-tertiary flex justify-evenly items-center">
        <Link
          onClick={() => LeaveLobby(navigate)}
          className="bg-secondary w-20 h-10 text-black rounded-full flex justify-center items-center shadow-md hover:shadow-lg hover:shadow-indigo-400 transition-transform delay-50 duration-200 ease-in-out hover:scale-105"
        >
          <ArrowBigLeft strokeWidth={2}/>
        </Link>
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
