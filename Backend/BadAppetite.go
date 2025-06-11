package main

type ingredients map[string]map[string]int

type unit struct {
	health        int
	attack        int
	attackRange   int
	specialStat1  string
	specialStat2  string
	xPosition     int
	yPosition     int
	orderInColumn int
	columnNumber  int
	isAlive       bool
}

type team struct {
	teamOwner string
	column1   []unit
	column2   []unit
	column3   []unit
}

type roundInfo struct {
	playerTeam    team
	isPlayerFirst bool
}

type turn struct {
	currentUnit  unit
	targetUnit   unit
	unitMovement bool
}

type result struct {
	roundTurns []turn
	isWinner   bool
	roundOver  bool
}

var MaximumUnits = 3

func BadAppetite(info <-chan roundInfo, enemyUnits chan<- team, results chan<- result) bool {

	for i := 0; i < 3; i++ {
		//first thing we need to do is create the enemy team
		var creationPoints int
		if i == 0 {
			creationPoints = 10
		}
		if i == 1 {
			creationPoints = 15
		} else {
			creationPoints = 20
		}
		var computerTeam = createUnitsForTheRound(creationPoints)
		//then we send it only proceeds once that team is sent
		enemyUnits <- computerTeam
		//we wait for the round info
		currentRoundInfo := <-info

		currentResult := result{
			isWinner:  false,
			roundOver: false,
		}

		var currentPlayerTurn bool
		if currentRoundInfo.isPlayerFirst == false {
			currentPlayerTurn = false
		} else {
			currentPlayerTurn = true
		}
		//we start the turn loop
		for !currentResult.roundOver {
			if currentPlayerTurn == true {
				//player action
				combat(currentRoundInfo.playerTeam, computerTeam, currentResult.roundTurns)
				currentPlayerTurn = false
			} else {
				//computer action
				combat(computerTeam, currentRoundInfo.playerTeam, currentResult.roundTurns)
				currentPlayerTurn = true
			}
		}
		// goes in until the roundOver bool is set to true
		results <- currentResult
	}
	return true
}

// creates units for the round which uses the cp to pick random stats the characters should use
func createUnitsForTheRound(cp int) team {

}

// performs one attack
func combat(attacker team, enemy team, roundTurns []turn) {

	for i := 0; i < MaximumUnits; i++ {

	}

}
