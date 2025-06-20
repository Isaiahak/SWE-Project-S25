import {useState} from 'react'
import {gameDataContext} from './UseGameDataContext' 

function GameDataProvider({children}){
	const [units, setUnits] = useState<Unit[]>([])
	const [foodStamps, setFoodStamps] = useState<int>(20)
	const [playerTeam, setPlayerTeam] = useState<team>({teamOwner: 'player', column1: [], column2: [], column3: []})
	return(
		<gameDataContext.Provider value={{units, setUnits, playerTeam, setPlayerTeam, foodStamps, setFoodStamps}}>
			{children}
		</gameDataContext.Provider>
	)
}

export default GameDataProvider
