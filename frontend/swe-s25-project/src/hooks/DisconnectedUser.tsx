import { useEffect} from 'react'
import {LeaveLobbySessionEnd} from '../services/LobbyServices'
import { disconnectFromLobby } from '../services/WebSocketServices'


export const useDisconnectedUser = () => {
  useEffect(() =>{
  const handleVisibilityChange = () => {
    if (document.hidden) {
        const userID = sessionStorage.getItem('user_id')
        const lobbyID = sessionStorage.getItem('lobby_id')
      if ( userID && lobbyID ){
        LeaveLobbySessionEnd()
        disconnectFromLobby()
      }
    } 
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  },[])
}