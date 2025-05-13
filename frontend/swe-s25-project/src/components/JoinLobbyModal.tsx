import {React, useState} from 'react'
import { JoinLobby } from '../services/LobbyServices.tsx'
import { useNavigate } from 'react-router-dom'

export default function JoinLobbyModal({isOpen, onClose}) {
  const navigate = useNavigate()
  const [lobbyID, setlobbyID] = useState('');
  if (!isOpen) return null;
  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="relative z-50 w-[90%] max-w-md p-6 bg-secondary text-secondary rounded-2xl opacity-100 shadow-xl flex flex-col gap-6 font-display">
      <button
        className="self-end text-3xl text-secondary hover:text-hover transition-transform duration-150 hover:scale-110"
        onClick={onClose}
      >
      ×
      </button>
      <input
        type="text"
        value={lobbyID}
        onChange={(e) => setlobbyID(e.target.value)}
        placeholder="Enter Lobby Code"
        className="w-full p-3 text-black rounded-lg outline-none border border-secondary placeholder-gray-600 focus:ring-2 focus:ring-hover"
      />
      <button
        className="py-3 px-5 bg-sidebar-primary text-white rounded-xl font-semibold shadow-md hover:bg-hover transition duration-200"
        onClick={() => JoinLobby(lobbyID, navigate)}
      >
      Join!
      </button>
    </div>
  </div>
  );
}