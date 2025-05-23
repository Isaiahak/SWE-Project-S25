import {useState, useEffect} from 'react'
import LobbyButton from '../components/LobbyButton'
import Player from '../components/Player'
import { Link } from 'react-router-dom'
import { ArrowBigLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ChangeNicknameModal from '../components/ChangeNicknameModal'
import ChangeIconModal from '../components/ChangeIconModal'
import { LeaveLobby, StartGame } from '../services/LobbyServices'
import { useLobbyWebSocket, disconnectFromLobby } from '../services/WebSocketService'

export default function LobbyPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [changeIcon, setChangeIcon] = useState(false)
  const [changeNickname, setChangeNickname] = useState(false)
  const lobbyId = sessionStorage.getItem('lobby_id')
  const userId = sessionStorage.getItem('user_id') 
  const { lobbyData, isConnected } = useLobbyWebSocket(lobbyId || '', userId || '')
  const avatars = [
    '/icons/anaconda.png',
    '/icons/bear.png',
    '/icons/blackbird.png',
    '/icons/cow.png',
    '/icons/ganesha.png',
    '/icons/jaguar.png',
    '/icons/panda-bear.png',
    '/icons/turtle.png'
  ]

  const handleLeaveLobby = async () => {
    try {
      await LeaveLobby(navigate)
      disconnectFromLobby()
    } catch (error) {
      console.error("Error leaving lobby:", error)
      setError("Failed to leave lobby")
    }
  }

  const handleChangeIcon = () => {
    setChangeNickname(false)
    setChangeIcon(true)
  }

  const handleChangeNickname = () => {
    setChangeIcon(false)
    setChangeNickname(true)
  }

  useEffect(() => {
    return () => {}
  }, [isConnected])

  if (!isConnected) {
      return <div className="items-center font-[3rem]">Loading lobby information...</div>
    }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (lobbyData == undefined){
    return <div>Connecting to lobby</div>
  }

  return (
    <div>
      {/* Top Section */}
      <div className="p-4 gap-12 h-[60vh] w-full bg-primary flex flex-row wrap">
      {lobbyData.Members && lobbyData.Members.map((memberId, index) => {
        if (lobbyData.UsedIDs[index]){
          const isCurrentUser = memberId === userId
          const isHost = memberId === lobbyData.HostID
          return(
            <Player key={memberId} isHost={isHost} isCurrentUser={isCurrentUser} avatar={avatars[lobbyData.UserIcons[index]]} nickname={lobbyData.UserNicknames[index]} />
          )
        }
        return null

      })} 
      </div>
      {/* Bottom Section */}
      <div className="h-[40vh] w-full bg-tertiary flex justify-evenly items-center">
        <Link
          onClick={() => handleLeaveLobby()}
          className="bg-secondary w-20 h-10 text-black rounded-full flex justify-center items-center shadow-md hover:shadow-lg hover:shadow-indigo-400 transition-transform delay-50 duration-200 ease-in-out hover:scale-105"
        >
          <ArrowBigLeft strokeWidth={2}/>
        </Link>
        <LobbyButton
          label="CHANGE NICKNAME"
          height="h-20"
          width="w-50"
          fontSize="text-[1rem]"
          onClick={() => handleChangeNickname()} 
        />
        {/* I need to create module for changing nickname */}
        <LobbyButton
          label="CHANGE AVATAR"
          height="h-20"
          width="w-50"
          fontSize="text-[1rem]"
          onClick={() => handleChangeIcon()}
        />
        {/* I need to create a module for changing avatar */}
        <LobbyButton
          label="START"
          height="h-40"
          width="w-100"
          fontSize="text-[5rem]"
          onClick={() => StartGame()}
        />
        <ChangeIconModal isOpen={changeIcon} onClose={() => setChangeIcon(false)}/>
        <ChangeNicknameModal isOpen={changeNickname} onClose={() => setChangeNickname(false)}/>
      </div>
      </div>
  )
}

