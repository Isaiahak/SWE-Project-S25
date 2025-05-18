import LobbyButton from "../components/LobbyButton";
import Player from "../components/Player";
import { Link } from "react-router-dom";
import { ArrowBigLeft } from "lucide-react";
import { LeaveLobby } from '../services/LobbyServices.tsx'
import { useNavigate } from 'react-router-dom'
import { ChangeNickname, ChangeIcon } from '../services/LobbyServices'

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
          onClick={() => ChangeNickname()}
        />
        <LobbyButton
          label="CHANGE AVATAR"
          height="h-20"
          width="w-50"
          fontSize="text-[1rem]"
          onClick={() => ChangeIcon()}
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

/*
import { LeaveLobby, GetLobbyInfo, ChangeNickname, ChangeIcon } from './LobbyServices';
import { useLobbyWebSocket, disconnectFromLobby } from './WebSocketService';

const LobbyComponent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get user and lobby IDs from sessionStorage
  const lobbyId = sessionStorage.getItem('lobby_id');
  const userId = sessionStorage.getItem('user_id');
  
  // Use our WebSocket hook
  const { lobbyData, isConnected } = useLobbyWebSocket(lobbyId || '', userId || '');
  
  // Handle leave lobby action
  const handleLeaveLobby = async () => {
    try {
      await LeaveLobby(navigate);
      disconnectFromLobby(); // Disconnect WebSocket when leaving
    } catch (error) {
      console.error("Error leaving lobby:", error);
      setError("Failed to leave lobby");
    }
  };

  // Get initial lobby info when component mounts
  useEffect(() => {
    const fetchInitialLobbyInfo = async () => {
      try {
        if (!lobbyId || !userId) {
          navigate('/');
          return;
        }
        
        // We can still use the existing GetLobbyInfo to get initial data if needed
        const initialData = await GetLobbyInfo();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lobby info:", error);
        setError("Failed to load lobby information");
        setLoading(false);
      }
    };
    
    fetchInitialLobbyInfo();
    
    // Disconnect WebSocket when component unmounts
    return () => {
      // Only disconnect if navigating away from lobby (handled by LeaveLobby)
    };
  }, [lobbyId, userId, navigate]);

  // Render user information based on their position in the lobby
  const renderUserInfo = () => {
    if (!lobbyData) return null;
    
    return (
      <div className="users-container">
        <h3>Players ({lobbyData.PlayerCount}/8)</h3>
        <div className="user-list">
          {lobbyData.Members.map((memberId, index) => {
            if (lobbyData.UsedIDs[index]) {
              const isCurrentUser = memberId === userId;
              const isHost = memberId === lobbyData.HostID;
              
              return (
                <div key={index} className={`user-item ${isCurrentUser ? 'current-user' : ''} ${isHost ? 'host' : ''}`}>
                  <div className="user-icon">Icon: {lobbyData.UserIcons[index]}</div>
                  <div className="user-nickname">
                    {lobbyData.UserNicknames[index]} {isHost ? '(Host)' : ''} {isCurrentUser ? '(You)' : ''}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading lobby information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="lobby-container">
      <h2>Game Lobby {lobbyData?.LobbyID}</h2>
      <div className="connection-status">
        {isConnected ? 
          <span className="connected">Connected to lobby</span> : 
          <span className="disconnected">Disconnected from lobby</span>
        }
      </div>
      
      <div className="lobby-info">
        <p><strong>Game:</strong> {lobbyData?.GameID}</p>
        <p><strong>Lobby Type:</strong> {lobbyData?.LobbyType}</p>
        <p><strong>Difficulty:</strong> {lobbyData?.Difficulty}</p>
      </div>
      
      {renderUserInfo()}
      
      <div className="lobby-actions">
        <button onClick={() => ChangeNickname()}>Change Nickname</button>
        <button onClick={() => ChangeIcon()}>Change Icon</button>
        <button onClick={handleLeaveLobby} className="leave-btn">Leave Lobby</button>
      </div>
    </div>
  );
};

export default LobbyComponent;
*/
