import {useContext,createContext} from 'react'

export const gameContext = createContext<int|undefined>(undefined)

function useGameContext(){
	const context = useContext(gameContext)
	if (!context) throw new Error("useGameContext must be used within a GameProvider")
	return context
}

export default useGameContext