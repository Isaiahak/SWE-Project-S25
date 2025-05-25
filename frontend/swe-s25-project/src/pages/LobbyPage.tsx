import {useState, useEffect} from 'react'
import LobbyButton from '../components/LobbyButton'
import Player from '../components/Player'
import { ArrowBigLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ChangeNicknameModal from '../components/ChangeNicknameModal'
import ChangeIconModal from '../components/ChangeIconModal'
import UtilityModal from '../components/UtilityModal'
import { LeaveLobby, StartGame } from '../services/LobbyServices'
import { useLobbyWebSocket, disconnectFromLobby } from '../services/WebSocketServices'

export default function LobbyPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [changeIcon, setChangeIcon] = useState(false)
  const [changeNickname, setChangeNickname] = useState(false)
  const [hostLeft, setHostLeft] = useState(false)
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
    const getLobbyData = async () =>{
      if(lobbyData != null){
        if (!lobbyData.LobbyState){
          setHostLeft(true)
          disconnectFromLobby()
          sessionStorage.removeItem('user_id')
          sessionStorage.removeItem('lobby_id')
          setTimeout(() => {
            navigate('/')
          }, '3000')
        }
      }
    }
    getLobbyData()

    return () => {}
  }, [lobbyData,navigate])

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
      <div className="p-4 h-[60vh] w-full bg-primary flex flex-row flex-wrap justify-start mx-auto">
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
        <button
          onClick={() => handleLeaveLobby()}
          className="bg-secondary w-20 h-10 text-black rounded-full flex justify-center items-center shadow-md hover:shadow-lg hover:shadow-indigo-400 transition-transform delay-50 duration-200 ease-in-out hover:scale-105"
        >
          <ArrowBigLeft strokeWidth={2}/>
        </button>
        <LobbyButton
          label="CHANGE NICKNAME"
          height="h-20"
          width="w-50"
          fontSize="text-[1rem]"
          onClick={() => handleChangeNickname()} 
        />
        <LobbyButton
          label="CHANGE AVATAR"
          height="h-20"
          width="w-50"
          fontSize="text-[1rem]"
          onClick={() => handleChangeIcon()}
        />
        <LobbyButton
          label="START"
          height="h-40"
          width="w-100"
          fontSize="text-[5rem]"
          onClick={() => StartGame()}
        />
        <ChangeIconModal isOpen={changeIcon} onClose={() => setChangeIcon(false)}/>
        <ChangeNicknameModal isOpen={changeNickname} onClose={() => setChangeNickname(false)}/>
        <UtilityModal isOpen={hostLeft} onClose={() => setHostLeft(false)} text="Host has left the lobby"/>
      </div>
      </div>
  )
}

