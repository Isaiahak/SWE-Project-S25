import { useContext, createContext } from 'react'
import {Unit, Team} from '../types/types'

interface GameDataContextType {
	units: Unit[]
	setUnits: (units:Unit[]) => void
	playerTeam: Team
	setPlayerTeam: (team: Team) => void
	foodStamps: int
}

export const gameDataContext = createContext<GameDataContextType | undefined>(undefined)

function useGameDataContext(){
	const context = useContext(gameDataContext)
	if (!context) throw new Error("useGameContext must be used within a GameProvider")
	return context
}
export default useGameDataContext