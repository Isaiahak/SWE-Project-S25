import { useEffect, useState } from 'react'

const backend_url = import.meta.env.VITE_BACKEND_URL

interface Lobby {
  LobbyID: string
  GameID: string
  PlayerCount: number
  LobbyType: string
  Difficulty: string
  HostID: string
  Members: string[]
  UsedIDs: boolean[]
  UserNicknames: string[]
  UserIcons: number[]
}

interface LobbyUpdateMessage {
  lobby: Lobby;
}

class LobbyWebSocketService {
  private static instance: LobbyWebSocketService
  private socket: WebSocket | null = null
  private listeners: Set<(data: LobbyUpdateMessage) => void> = new Set()
  private reconnectTimeout: NodeJS.Timeout | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private lobbyId: string | null = null
  private userId: string | null = null

  private constructor() {}

  public static getInstance(): LobbyWebSocketService {
    if (!LobbyWebSocketService.instance) {
      LobbyWebSocketService.instance = new LobbyWebSocketService()
    }
    return LobbyWebSocketService.instance
  }

  public connect(lobbyId: string, userId: string): void {
    this.lobbyId = lobbyId
    this.userId = userId
    
    if (this.socket) {
      this.socket.close()
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsBaseUrl = backend_url.replace(/^https?:\/\//, '')
    this.socket = new WebSocket(`${wsProtocol}//${wsBaseUrl}/ws/lobby/${lobbyId}?user_id=${userId}`)
    this.socket.onopen = this.onOpen.bind(this)
    this.socket.onmessage = this.onMessage.bind(this)
    this.socket.onclose = this.onClose.bind(this)
    this.socket.onerror = this.onError.bind(this)
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
    
    this.lobbyId = null
    this.userId = null
    this.reconnectAttempts = 0
  }

  public addListener(callback: (data: LobbyUpdateMessage) => void): void {
    this.listeners.add(callback)
  }

  public removeListener(callback: (data: LobbyUpdateMessage) => void): void {
    this.listeners.delete(callback)
  }

  private onOpen(): void {
    console.log('WebSocket connection established')
    this.reconnectAttempts = 0
  }

  private onMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data) as LobbyUpdateMessage
      this.notifyListeners(data)
    } catch (error) {
      console.error('Error parsing WebSocket message', error)
    }
  }

  private onClose(event: CloseEvent): void {
    this.socket = null
    console.log(`WebSocket connection closed with code ${event.code}`)
  
    if (event.code !== 1000 && event.code !== 1001) {
      this.attemptReconnect()
    }
  }

  private onError(error: Event): void {
    console.error('WebSocket error:', error)
  }

  private notifyListeners(data: LobbyUpdateMessage): void {
    this.listeners.forEach(listener => {
      listener(data)
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached')
      return
    }

    const backoffTime = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
    
    console.log(`Attempting to reconnect in ${backoffTime / 1000} seconds...`)
    
    this.reconnectTimeout = setTimeout(() => {
      if (this.lobbyId && this.userId) {
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts + 1}`)
        this.reconnectAttempts++
        this.connect(this.lobbyId, this.userId)
      }
    }, backoffTime);
  }
}

export const useLobbyWebSocket = (lobbyId?: string, userId?: string) => {
  const [lobbyData, setLobbyData] = useState<Lobby | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  
  useEffect(() => {
    if (!lobbyId || !userId) return
    
    const service = LobbyWebSocketService.getInstance()
    
    const handleLobbyUpdate = (data: LobbyUpdateMessage) => {
      setLobbyData(data.lobby)
      setIsConnected(true)
    }
    
    service.addListener(handleLobbyUpdate)
    service.connect(lobbyId, userId)
    
    return () => {
      service.removeListener(handleLobbyUpdate)
    }
  }, [lobbyId, userId])
  
  const disconnect = () => {
    const service = LobbyWebSocketService.getInstance()
    service.disconnect()
    setIsConnected(false)
    setLobbyData(null)
  }
  
  return { lobbyData, isConnected, disconnect }
}

export const disconnectFromLobby = () => {
  const service = LobbyWebSocketService.getInstance()
  service.disconnect()
}
