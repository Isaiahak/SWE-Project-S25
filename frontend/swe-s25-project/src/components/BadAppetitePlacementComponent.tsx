import { useState, useEffect } from 'react'
import useGameDataContext from '../hooks/UseGameDataContext'

const PlacementComponent = () => {

	const [leftPosition, setLeftPosition] = useState(17.5)
	const [mousePosition,setMoustPosition] = useState({x:0,y:0})
	const [mouseHeld, setMouseHeld] = useState(false)
	const [mouseOver, setMouseOver] = useState(false)
	const {units, setUnits,foodStamps, setFoodStamps} = useGameDataContext()


	const board = [
	[1,2,3],
	[1,2,3],
	[1,2,3],
	[1,2,3]
	]

	const mouseOverUnit = () =>{
		setMouseOver(true)
	}

	const mouseOffUnit = () =>{
		setMouseOver(false)
	}

	useEffect(()=>{
		const handleMouseMove = (e) =>{
			setMoustPosition({x:e.clientX,y:e.clientY})
		}

		const handleMouseUp = () => {
			if(mouseOver){
				setMouseOver(false)
			}
			setMouseHeld(false)
		}

		const handleMouseDown = () => {
			if(mouseOver){
				setMouseHeld(true)
			}
		}
		window.addEventListener('mousedown',handleMouseDown)
		window.addEventListener('mouseup',handleMouseUp)
		window.addEventListener('mousemove', handleMouseMove)
		console.log(mouseOver)
   		return () => {
   			window.removeEventListener('mousemove', handleMouseMove)
   			window.removeEventListener('mouseup',handleMouseUp)
   			window.removeEventListener('mousedown',handleMouseDown)
   		}
	},[mouseOver])

	useEffect(() =>{
		const handleUnitMovement = () =>{
			if(mousePosition.x >= 160 && mousePosition.x <= 420){
				setLeftPosition(17.5)
			}
			else if(mousePosition.x >= 600 && mousePosition.x <= 860){
				setLeftPosition(47.5)

			}
			else if(mousePosition.x >= 1040 && mousePosition.x <= 1300){
				setLeftPosition(77.5)
			}
		}
		if (mouseHeld){
			handleUnitMovement()
		}
	},[mouseHeld,mousePosition])

	const EnemyBoard = () => {
		return(
		<div className="flex flex-row gap-20">
			<div className="bg-primary  text-white w-24 h-24 flex items-center border-b-5 border-l-5 rounded-2xl border-secondary  justify-center"
			style={{ transform: ' rotateZ(0deg)', transformStyle: 'preserve-3d' }}></div>
			<div className="bg-primary text-white w-24 h-24 flex items-center border-b-5 border-l-5 rounded-2xl border-secondary  justify-center"
			style={{ transform: ' rotateZ(0deg)', transformStyle: 'preserve-3d' }}></div>
			<div className="bg-primary text-white w-24 h-24 flex items-center border-b-5 border-l-5 rounded-2xl border-secondary  justify-center"
			style={{ transform: ' rotateZ(0deg)', transformStyle: 'preserve-3d' }}></div>
		</div>
		)
	}

	const AlleyBoard = () => {
		return(
		<div className="flex flex-row gap-20">
			<div className="bg-primary text-white w-24 h-24 flex items-center border-b-5 border-l-5 rounded-2xl border-secondary  justify-center"
			style={{ transform: ' rotateZ(0deg)', transformStyle: 'preserve-3d' }}></div>
			<div className="bg-primary text-white w-24 h-24 flex items-center border-b-5 border-l-5 rounded-2xl border-secondary  justify-center"
			style={{ transform: ' rotateZ(0deg)', transformStyle: 'preserve-3d' }}></div>
			<div className="bg-primary text-white w-24 h-24 flex items-center border-b-5 border-l-5 rounded-2xl border-secondary  justify-center"
			style={{ transform: ' rotateZ(0deg)', transformStyle: 'preserve-3d' }}></div>
		</div>
		)
	}

	const Board = () =>{
		return(
		<div className="min-w-[90%] h-[90%] bg-primary">	
			<div className=" flex flex-col justify-center min-w-[%60] w-[60%] h-[90%] pt-4 pb-4 mx-auto rounded bg-tertiary border-2 border-secondary flex flex-col gap-1 opacity-0.3 hover:opacity-0.7">
				<div className="self-center p-4 pr-10 pl-10 pt-5 pb-5 bg-primary border-8 border-secondary rounded-2xl "
					style={{ transform: 'rotateZ(-35deg) rotateY(20deg) rotateX(45deg) scaleY(0.85) scaleX(1.15)'}}>
					<EnemyBoard/>
					<div>	
						{board.map(((row, i) => (
							<div key={i} className="flex gap-20">
								{row.map(((element,j) => (
									<div key={j} className="bg-gray-300 text-white w-24 h-24 flex items-center border-b-5 border-l-5 rounded-2xl border-secondary  justify-center"
			  						style={{ transform: 'rotateX(10deg) rotateZ(0deg)', transformStyle: 'preserve-3d' }}/>	
								)))}
							</div>
						)))}	
					</div>
					<AlleyBoard/>
				</div>
			</div>
		</div>
		)
	}

	return(
		<div className="w-screen h-screen mx-auto flex flex-col">
			<div className="w-[10%] mx-auto">Placeholder for notifications</div>
			<Board/>
		</div>
	)
	
}
export default PlacementComponent