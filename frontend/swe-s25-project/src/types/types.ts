export type Unit = {
	health:        int,
	attack:        int,
	attackRange:   int,
	specialStat:  string[],
	yPosition:     int,
	orderInColumn: int,
	columnNumber:  int,
	isAlive:       bool,
}

export type Team = {
	teamOwner: string,
	column1:   Unit[],
	column2:   Unit[],
	column3:   Unit[],
}

export type Attribute = {
	name: string,
	type: string,
	value: string | int,
	cost: int,
} 