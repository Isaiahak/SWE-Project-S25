import SidebarButton from "./SidebarButton"
import useGameContext from "../hooks/useGameContext.tsx"
import { CreateLobby, GetRandomLobby } from "../services/LobbyServices.tsx"
import JoinLobbyModal from "./JoinLobbyModal.tsx"
import NoLobbyModal from "./NoLobbyModal.tsx"
import {useState} from 'react'
import { useNavigate, Link } from "react-router-dom"

export default function Sidebar() {
	const {game} = useGameContext()
	const navigate = useNavigate()
	const [LobbyModal, setLobbyModal] = useState(false)
  const [NoLobby, setNoLobby] = useState(false)

  const handleGetRandomLobby  = async (navigate) =>{
    const result = await GetRandomLobby(navigate)
    if (result == false){
      setNoLobby(true)
    }
  }

  return (
    <nav className="h-screen w-60 flex flex-col justify-between bg-sidebar-primary shadow-lg">
      <div className="flex flex-col">
        <h1 className="text-center font-[Bebas Neue] font-bold text-[1.75rem]">
          AKEP GAMES
        </h1>
        <Link onClick={() => handleGetRandomLobby(navigate)}>
          <SidebarButton label="QUICK PLAY" /> 
        </Link>
        <Link onClick={() => CreateLobby(game,navigate)}>
          <SidebarButton label="CREATE"/>
        </Link>
        <Link onClick={() => setLobbyModal(true)}>
        	<SidebarButton label="JOIN" />
        </Link>
        <JoinLobbyModal isOpen={LobbyModal} onClose={() => setLobbyModal(false)}/>
        <NoLobbyModal isOpen={NoLobby} onClose={() => setNoLobby(false)}/>
      </div>
    </nav>
  );
}
