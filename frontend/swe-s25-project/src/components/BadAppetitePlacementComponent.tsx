import {useState, useEffect} from 'react'

const PlacementComponent = () => {

	const [leftPosition, setLeftPosition] = useState(17.5)
	const [mousePosition,setMoustPosition] = useState({x:0,y:0})
	const [mouseHeld, setMouseHeld] = useState(false)
	const [mouseOver, setMouseOver] = useState(false)

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

	const Board = () =>{
		return(
		<div className="min-w-[90%] h-[90%]">	
			<div className=" min-w-[90%] h-[90%] pt-4 pb-4 mx-auto rounded bg-tertiary grid grid-cols-3 grid-rows-9 gap-1 opacity-0.3 hover:opacity-0.7">
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-secondary rounded border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-tertiary rounded transform hover:-translate-y-1 border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-tertiary rounded transform hover:-translate-y-1 border-primary border-4 transition"></div>
				<div className=" w-[60%] mx-auto bg-tertiary rounded transform hover:-translate-y-1 border-primary border-4 transition"></div>
			</div>
		</div>
		)
	}

	const Unit = () =>{
		return(
			<div className={` bg-black fixed top-[77%] w-16 h-16`}
				style={{left:`${leftPosition}%`}}
				onMouseOver={mouseOverUnit}
				onMouseOut={mouseOffUnit}/>
			)
	}

	return(
		<div className="w-[90%] h-screen mx-auto align-content">
			<div className="w-[10%] mx-auto">Placeholder for notifications</div>
			<Board/>
			<Unit/>
		</div>
	)
	
}
export default PlacementComponent