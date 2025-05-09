import {useContext,createContext} from 'react'

export const gameContext = createContext()

function useGameContext(){
	const context = useContext(gameContext)
	if (context === undefined){
		throw new Error('not used within Game provider')
	}
	return context
}

export default useGameContext