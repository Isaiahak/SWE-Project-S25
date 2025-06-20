import { useState } from 'react'
import PlacementComponent from '../components/BadAppetitePlacementComponent'
import CreationComponent from '../components/BadAppetiteCreationComponent'
import GameDataProvider from '../hooks/GameDataContext'



const GamePage = () =>{
	const [gameState, setGameState] = useState<number>(1)

	const CurrentComponent = () => {
		let current = undefined

		if (gameState == 1){
			current = <CreationComponent setGameState={setGameState}/>
		}
		if (gameState == 2){
			current = <PlacementComponent setGameState={setGameState}/>
		}
		return(
			<div>{current}</div>
		)
	}

	return(
	<div className="h-screen w-full flex justify-center self-center">
		<GameDataProvider>
			<CurrentComponent/>
		</GameDataProvider>
	</div>
	)
}
export default GamePage