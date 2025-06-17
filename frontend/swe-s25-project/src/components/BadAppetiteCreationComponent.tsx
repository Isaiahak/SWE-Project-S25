import {useState} from 'react'

default export const CreationComponent = () =>{

	interface Unit{
		unitID:        string
		health:        int
		attack :       int
		attackRange:   int
		specialStat1:  string
		specialStat2:  string
		yPosition:     int
		orderInColumn: int
		columnNumber:  int
		isAlive:       bool
	}

	const units = Unit[]

	return(
		<div>
			
		</div>
	)
}