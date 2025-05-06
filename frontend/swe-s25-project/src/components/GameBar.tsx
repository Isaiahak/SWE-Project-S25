import '../styling/GameBar.css'
import useGameContext from './useGameContext.tsx'

function GameBar(){

	const {setGame} = useGameContext()

	return (
		<div className="game-selection-container">
			<div className="game-1-container" onClick={() => setGame(1)}>Game 1</div>
			<div className="game-2-container" onClick={() => setGame(2)}>Game 2</div>
			<div className="game-3-container" onClick={() => setGame(3)}>Game 3</div>
			<div className="game-4-container" onClick={() => setGame(4)}>Game 4</div>
			<div className="game-5-container" onClick={() => setGame(5)}>Game 5</div>
		</div>
	)
}

export default GameBar