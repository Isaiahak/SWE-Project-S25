import {useState} from 'react'
import {gameContext} from './useGameContext.tsx'

function GameProvider({children}){
	const [game, setGame] = useState(1)

	return(
		<gameContext.Provider value={{game, setGame}}>
			{children}
		</gameContext.Provider>
	)	
}

export default GameProvider