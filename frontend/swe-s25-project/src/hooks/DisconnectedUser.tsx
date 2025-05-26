import { useEffect} from 'react'
import { LeaveLobbySessionEnd } from '../services/LobbyServices'
import { disconnectFromLobby } from '../services/WebSocketServices'

export const useDisconnectedUser = () => {
  useEffect(() =>{
  const handleBeforeUnload = () => {
      console.log('we get here')
      const userID = sessionStorage.getItem('user_id')
      const lobbyID = sessionStorage.getItem('lobby_id')
      if ( userID && lobbyID ){
        (async () =>{

          await LeaveLobbySessionEnd()
          disconnectFromLobby()
        })()
    } 
  }
  window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  },[])
}