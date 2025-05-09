import SidebarButton from "./SidebarButton";
import useGameContext from "../hooks/useGameContext.tsx"
import { CreateLobby } from "../services/LobbyServices.tsx"
import JoinLobbyModal from "./JoinLobbyModal.tsx"
import {useState} from 'react'
import { useNavigate, Link } from "react-router-dom"


export default function Sidebar() {
	const {game} = useGameContext()
	const navigate = useNavigate()
	const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <nav className="h-screen w-60 flex flex-col justify-between bg-sidebar-primary shadow-lg">
      <div className="flex flex-col">
        <h1 className="text-center font-[Bebas Neue] font-bold text-[1.75rem]">
          Aken Studios
        </h1>
        <SidebarButton label="PLAY" />
        <Link onClick={() => CreateLobby(game,navigate)}>
          <SidebarButton label="CREATE"/>
        </Link>
        <Link onClick={() => setIsModalOpen(true)}>
        	<SidebarButton label="JOIN" />
        </Link>
        <SidebarButton label="FRIENDS" />
        <JoinLobbyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
      </div>
    </nav>
  );
}
