import {useState, useEffect} from 'react'
import LobbyButton from '../components/LobbyButton'
import Player from '../components/Player'
import { Link } from 'react-router-dom'
import { ArrowBigLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ChangeNickname, ChangeIcon, LeaveLobby, GetLobbyInfo} from '../services/LobbyServices'
import { useLobbyWebSocket, disconnectFromLobby } from '../services/WebSocketService'

export default function LobbyPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [initialLobbyData, setInitialLobbyData] = useState(null)
  const lobbyId = sessionStorage.getItem('lobby_id')
  const userId = sessionStorage.getItem('user_id') 

  const { lobbyData, isConnected } = useLobbyWebSocket(lobbyId || '', userId || '')
  
  const currentLobbyData = lobbyData || initialLobbyData

  const handleLeaveLobby = async () => {
    try {
      await LeaveLobby(navigate)
      disconnectFromLobby()
    } catch (error) {
      console.error("Error leaving lobby:", error)
      setError("Failed to leave lobby")
    }
  }

  useEffect(() => {
    const fetchInitialLobbyInfo = async () => {
      try {
        if (!lobbyId || !userId) {
          console.log("no lobby and user id")
          navigate('/')
          return
        }
        
        const initialLobbyData = await GetLobbyInfo()
        setInitialData(initialLobbyData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching lobby info:", error)
        setError("Failed to load lobby information")
        setLoading(false)
      }
    }
    
    fetchInitialLobbyInfo();
    
    return () => {}
  }, [lobbyId, userId, navigate])

  if (loading && !currentLobbyData) {
      return <div>Loading lobby information...</div>
    }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!currentingLobbyData){
    return <div>Connecting to lobby</div>
  }

  return (
    <div>
      {/* Top Section */}
      <div className="p-4 gap-12 h-[60vh] w-full bg-primary flex flex-row wrap">
      {currentLobbyData.Members && currentLobbyData.Members.map((memberId, index) => {
        if (currentLobbyData.UsedIDs[index]){
          const isCurrentUser = memberId === userId
          const isHost = memberId === currentLobbyData.HostID
          return(
            <Player key={memberId} isHost={isHost} isCurrentUser={isCurrentUser} avatar={currentLobbyData.UserIcons[index]} nickname={currentLobbyData.UserNicknames[index]} />
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
        />
        {/* I need to create module for changing nickname */}
        <LobbyButton
          label="CHANGE AVATAR"
          height="h-20"
          width="w-50"
          fontSize="text-[1rem]"
        />
        {/* I need to create a module for changing avatar */}
        <LobbyButton
          label="START"
          height="h-40"
          width="w-100"
          fontSize="text-[5rem]"
        />
      </div>
      </div>
  )
}

