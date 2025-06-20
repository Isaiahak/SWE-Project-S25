import React, { useState, useEffect} from 'react'
import useGameDataContext from '../hooks/UseGameDataContext'
import {Attribute, Unit} from '../types/types'
import UtilityModal from './UtilityModal'



const attributes: Attribute[] = [
	{name: "Chicken", type: "Proteins", stat: "health", value: 3, cost: 3},
	{name: "Fish", type: "Proteins", stat: "health", value: 2, cost: 2},
	{name: "Garlic", type: "Flavour Enchancer", stat: "specialStat", value: "Burning effect", cost: 6},
	{name: "Noodles", type: "Carbs", stat: "attackRange", value: 3, cost: 3},
	{name: "Chill Pepper", type: "Flavour Enchancer", stat: "specialStat", value: "Attack Increase", cost: 6},
	{name: "Egg", type: "Proteins", stat: "health", value: 4, cost: 4},
	{name: "Lettuce", type: "Veggie", stat: "attack", value: 2, cost: 2},
	{name: "Onion", type: "Veggie", stat: "attack", value: 5, cost: 5},
	{name: "Soy Sauce", type: "Flavour Enchancer", stat: "specialStat", value: "Miss Chance", cost: 6},
	{name: "Taco Shell", type: "Carbs", stat: "attackRange", value: 2, cost: 2},
	{name: "Rice", type: "Carbs", stat: "attackRange", value: 4, cost: 4},
	{name: "Beef", type: "Proteins", stat: "health", value: 5, cost: 5},
	{name: "Tomato", type: "Veggie", stat: "attack", value: 3, cost: 3},
]

export default function CreationComponent({setGameState}) {
  const [selectedAttributes, setSelectedAttributes] = useState<attributes[]>([])
  const {units, setUnits,foodStamps, setFoodStamps} = useGameDataContext()
  const defaultUnit = {
  	health: 1,
		attack: 1,
		attackRange: 1,
		specialStat: [],
		yPosition: undefined,
		orderInColumn: undefined,
		columnNumber: undefined,
		isAlive: true,
	}
  const [currentUnit, setCurrentUnit] = useState<Unit>(defaultUnit)
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number | null>(null)
  const [createdDisplayed, setCreatedDisplayed] = useState<bool>(true)
  const [displayUnit, setDisplayUnit] = useState<Unit>(currentUnit)
  const [warning, setWarning] = useState<bool>(false)
  const [warningMessage, setWarningMessage] = useState<string>(undefined)
  const [previousFoodStamps, setPreviousFoodStamps] = useState<number[]>([foodStamps])

  useEffect(() => {
  	if (createdDisplayed == false){
  		setDisplayUnit(units[selectedUnitIndex])
  	}else{
  		setDisplayUnit(currentUnit)
  	}
  },[createdDisplayed,units,selectedUnitIndex,currentUnit])


  const toggleAttribute = (attr: Attribute) => {
  	setCreatedDisplayed(true)
  	const modifyUnit = (operation: string, attribute: keyof Unit) => {
  		if (attr.type === "Flavour Enchancer"){
  			if (operation === "add"){
  				if ( currentUnit.specialStat.length < 2){
  					setCurrentUnit(prev => {
  					return{...prev, specialStat: [...prev.specialStat, attr.value]}})
  				}else{
			  		setWarningMessage("You can only have 2 special Stats")
			  		setWarning(true)
			  	}
  			}else{
  				if (currentUnit.specialStat.length > 0){
  					if (currentUnit.specialStat.length == 2){
  						//here
  						setCurrentUnit(prev => {
  							if (prev.specialStat[1] === attr.value){
  								return{...prev, specialStat: prev.specialStat.slice(0,-1)}
  							}else{
  								return{...prev, specialStat: prev.specialStat.slice(1)}
  							}
  						})
  					}else{	
	  					setCurrentUnit(prev => {
	  					return{...prev, specialStat: prev.specialStat.slice(0,-1) }})  				
  					} 
  				}
  			}
  		}
  		if (attr.type === "Carbs"){
  			if (operation ==="add"){
  				setFoodStamps(prev => prev - attr.value)
  				setCurrentUnit(prev => ({...prev, attackRange: attr.value }))
  			}else{
  				setFoodStamps(prev => prev + attr.value)
  				setCurrentUnit(prev => ({...prev, attackRange: 1}))

  			}
  		}else if (attr.type != "Carbs" && attr.type != "Flavour Enchancer"){
	  		if (operation === "add"){  			
	  			setCurrentUnit(prev => ({...prev, [attribute]: prev[attribute] + attr.value}))
	  		}
	  		if (operation === "remove"){
	  			setCurrentUnit(prev => ({...prev, [attribute]: prev[attribute] - attr.value}))
	  		}
  		}
  	}
  
  	const toggleOn = () => {
  		if (foodStamps - attr.cost >= 0){
  			setFoodStamps(prev => prev - attr.cost)  			
	  		modifyUnit("add", attr.stat)
	  		if (currentUnit.specialStat.length < 2){
	  			setSelectedAttributes(prev => [...prev, attr])
	  		}
  		}else{
  			setWarningMessage("Out of Food Stamps!")
  			setWarning(true)
  		}
  	}

  	const toggleOff = () => {
  		setFoodStamps(prev => prev + attr.cost)
  		modifyUnit("remove", attr.stat)
  		if ((attr.type === "Flavour Enchancer" && currentUnit.specialStat.length > 0) || attr.type != "Flavour Enchancer"){
  			setSelectedAttributes(prev => prev.filter(a => a !== attr))
  		}
  	}

    if(selectedAttributes.includes(attr)){
    	toggleOff()  
   	}else{
 			toggleOn()
		}
  }

  const handleCreate = () => {
  	if (foodStamps >= 3){
  		setFoodStamps(prev => {
  			const newFoodStamps = prev - 3
  			setPreviousFoodStamps( prev => [...prev,newFoodStamps])
  			return newFoodStamps
  		})
	  	setCreatedDisplayed(true)
	  	setDisplayUnit(currentUnit)
	    setSelectedAttributes([])
	    setCurrentUnit(defaultUnit)
	    setUnits(prev => [...prev,currentUnit])
  	}else{
  		setWarningMessage("Need More Food Stamps!")
  		setWarning(true)
  	}
  }

  const handleUndo = () => {
  	if (units.length > 0){
  		setPreviousFoodStamps(prev => {
  			const list = prev.slice(0,-1)
  			const lastValue = prev[prev.length-2]
  			setFoodStamps(lastValue)
  			return list
  		})
  		setCreatedDisplayed(true)
	    setDisplayUnit(currentUnit)
	    setSelectedAttributes([])
	    setCurrentUnit(defaultUnit) 
	    setUnits(prev => (prev.slice(0,-1)))
  	}else{
  		setWarningMessage("Cannot Undo nothing!")
  		setWarning(true)
  	}
  }

  const handleReset = () =>{
  	setFoodStamps(previousFoodStamps[previousFoodStamps.length-1])
  	setSelectedAttributes([])
    setCurrentUnit(defaultUnit)
  }

  const handleReady = () => {
    if (units.length > 0) {
      setGameState(2)
    }else{
  		setWarningMessage("Try Creating a Unit First!!")
  		setWarning(true)
  	}
  }

  const handleUnitSelection = (i) =>{
  	setSelectedUnitIndex(i)
  	setCreatedDisplayed(false)
  }

  return (
	<div className="flex h-full w-[90%] self-center p-4 gap-4 font-mono bg-tertiary text-secondary rounded-2xl">
		{/* Stats Sidebar */}
		<UtilityModal isOpen={warning} onClose={() => setWarning(false)} text={warningMessage}/>
		<div className="w-64 p-4 border bg-primary  border-secondary rounded-lg bg-sidebar text-white">
			<h2 className="text-lg font-bold font-display mb-2">Current Unit</h2>
			{(
			<ul className="list-none list-inside p1-5 space-y-1 ">
				<div className=" h-40 border-2 border-secondary ">
					<img src={`${displayUnit.health >= 1 && displayUnit.health <= 3 ? '/BadAppetiteImages/BurgerUnit.png' :
						 displayUnit.health >= 4 && displayUnit.health <= 6 ? '/BadAppetiteImages/PizzaUnit.png' :
						 displayUnit.health >= 7 && displayUnit.health <= 9 ? '/BadAppetiteImages/TacoUnit.png' :
						 '/BadAppetiteImages/WrapUnit.png' }`}/>			
				</div>
				<li>{`Health: ${displayUnit.health}`}</li>
				<li>{`Attack: ${displayUnit.attack}`}</li>
				<li>{`Attack Range: ${displayUnit.attackRange}`}</li>
				<li>{`Special Stat1:`}</li>
				<p>{`${displayUnit.specialStat[0] == undefined ? '' : displayUnit.specialStat[0]} `}</p>
				<li>{`Special Stat2:`}</li>
				<p>{`${displayUnit.specialStat[1] == undefined ? '' : displayUnit.specialStat[1]}`}</p>
			</ul>
			)}
		</div>


		{/* center container*/}
		<div className= "flex flex-col h-full w-[70%] self-start gap-6">
			{/*info bar*/}
			<div className="flex flex-row w-[100%] h-[25%] items-center justify-center bg-tertiary">
				<div className= "flex self-start w-[25%] h-[100%] justify-center items-center bg-primary rounded-md border-2 border-secondary">
					<div className= "text-2xl">{`Food Stamps: ${foodStamps}`}</div>
				</div>
					<h1 className="text-4xl m-auto">Bad Appetite</h1>
					<div className= "flex self-start w-[25%] h-[100%] justify-center items-center bg-primary rounded-md border-2 border-secondary">
						<div className="text-2xl">{`Timer:`}</div>
				</div>
			</div>
			{/* Attribute Selection */}
			<h2 className="text-lg font-bold self-center font-display">Attributes</h2>
			<div className=" w-[100%] grid grid-cols-5 items-center gap-4 p-4 border bg-primary border-secondary rounded-lg">
				{attributes.map(attr => (
				<div key={attr.name}
				onClick={() => toggleAttribute(attr)}
				className={`w-16 h-16 flex items-center justify-center rounded-full cursor-pointer transition text-center
				${attr.type == "Carbs" ? 'bg-amber-500' : attr.type == "Veggie" ? 'bg-green-400' : attr.type == "Proteins" ? 'bg-amber-950' : 'bg-violet-600'}
				${{}}`}
				title={`Stat: ${attr.value}`}
				>
					{attr.name}
				</div>
				))}
			</div>

			{/* Units Display */}
			<div className="flex flex-col gap-2 h-full  w-[100] p-4 border bg-primary  border-secondary rounded-lg  overflow-auto">
				<h2 className="text-lg font-bold font-display mb-2">Created Units</h2>
				<div className="flex flex-row max-w-full gap-4 overflow-x-auto whitespace-nowrap p-4 flex-nowrap">	
				{units.map((unit, i) => (
					<div key={i}
						className="bg-sidebar w-40 h-40  flex-none flex items-center justify-center p-2 border-secondary border-2 rounded cursor-pointer  hover:bg-hover transition"
						onClick={() => handleUnitSelection(i)}
						>
						<img src={`${unit.health >= 1 && unit.health <= 3 ? '/BadAppetiteImages/BurgerUnit.png' :
						 unit.health >= 4 && unit.health <= 6 ? '/BadAppetiteImages/PizzaUnit.png' :
						 unit.health >= 7 && unit.health <= 9 ? '/BadAppetiteImages/TacoUnit.png' :
						 '/BadAppetiteImages/WrapUnit.png' }`}/>	
					</div>
				))}
				{(
					<div className={`p-2 rounded  w-40 h-40 flex-none bg-primary flex items-center justify-center border-secondary border-2 text-black`}
					>
						<img src={`${displayUnit.health >= 1 && displayUnit.health <= 3 ? '/BadAppetiteImages/BurgerUnit.png' :
						 displayUnit.health >= 4 && displayUnit.health <= 6 ? '/BadAppetiteImages/PizzaUnit.png' :
						 displayUnit.health >= 7 && displayUnit.health <= 9 ? '/BadAppetiteImages/TacoUnit.png' :
						 '/BadAppetiteImages/WrapUnit.png' }`}/>			
					</div>
				)}
				</div>
			</div>

			{/* Operation Controls */}
			<div className="flex flex-col  gap-2 p-4 border mt-auto bg-primary border-secondary rounded-lg">
				<h2 className="text-lg self-center font-display font-bold mb-2">Controls</h2>
				<div className="flex flex-row self-center center gap-2 p-4 border border-secondary rounded-lg">
					<button
					className="min-w-48 w-48 self-center bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-black font-semibold"
					onClick={handleCreate}
					>
						Create (3 Stamps)
					</button>
					<button
					className="min-w-48 w-48 self-center bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded text-black font-semibold"
					onClick={handleUndo}
					>
						Undo
					</button>
					<button
					className="min-w-48 w-48 self-center bg-red-400 hover:bg-yellow-500 px-4 py-2 rounded text-black font-semibold"
					onClick={handleReset}
					>
						Reset
					</button>
					<button
					className="min-w-48 w-48 self-center bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded text-black font-semibold disabled:opacity-30"
					onClick={handleReady}
					disabled={units.length === 0}
					>
						Ready
					</button>
				</div>
			</div>
		</div>
		<div className="w-64 p-4 border bg-primary  border-secondary rounded-lg bg-sidebar text-white">
			<h2 className="text-lg font-bold font-display mb-2">Enemy Unit</h2>
		</div>
	</div>
  )
}


