import {useState} from 'react'
import {gameContext} from './useGameContext.tsx'

function GameProvider({children}){
	const [game, setGame] = useState(null)

	return(
		<gameContext.Provider value={{game, setGame}}>
			{children}
		</gameContext.Provider>
	)	
}

export default GameProvider