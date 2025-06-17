package main

import (
	"github.com/google/uuid"
	"math/rand"
	"time"
)

type ingredients map[string]map[string]int

type unit struct {
	unitID        string
	health        int
	attack        int
	attackRange   int
	specialStat1  string
	specialStat2  string
	yPosition     int
	orderInColumn int
	columnNumber  int
	isAlive       bool
}

type roundUnit struct {
	unitID  string
	health  int
	attack  int
	isAlive bool
}

type team struct {
	teamOwner string
	column1   []unit
	column2   []unit
	column3   []unit
}

type turn struct {
	currentUnit roundUnit
	targetUnit  roundUnit
}

type result struct {
	roundTurns []turn
	isWinner   bool
	roundOver  bool
}

var MaximumUnits = 3

func BadAppetite(players int, info <-chan team, enemyUnits chan<- team, results chan<- result) bool {
	var playerFirst = true
	for i := 0; i < 3; i++ {
		//first thing we need to do is create the enemy team
		var creationPoints int
		if i == 0 {
			creationPoints = 4
		}
		if i == 1 {
			creationPoints = 5
		} else {
			creationPoints = 6
		}
		var computerTeam = createUnitsForTheRound(creationPoints)
		//then we send it only proceeds once that team is sent
		enemyUnits <- computerTeam
		//we wait for the round info
		var playerUnits team
		var currentUnits team
		
		currentUnits.teamOwner = "player"
		for i := 0; i < players; i++{
			playerUnits = <-info
			currentUnits.column1 = append(currentUnits.column1, playerUnits.column1...)
			currentUnits.column2 = append(currentUnits.column2, playerUnits.column2...)
			currentUnits.column3 = append(currentUnits.column3, playerUnits.column3...)
		}
		

		currentResult := result{
			isWinner:  false,
			roundOver: false,
		}

		var currentPlayerTurn bool
		if playerFirst == false {
			currentPlayerTurn = false
		} else {
			currentPlayerTurn = true
		}
		//we start the turn loop
		for !currentResult.roundOver {
			if currentPlayerTurn == true {
				//player action
				var complete, playerWins = combat(currentUnits, computerTeam, currentResult.roundTurns)
				currentResult.isWinner = playerWins
				currentResult.roundOver = complete
				currentPlayerTurn = false
			} else {
				//computer action
				var complete, playerWins = combat(computerTeam, currentUnits, currentResult.roundTurns)
				currentResult.isWinner = playerWins
				currentResult.roundOver = complete
				currentPlayerTurn = true
			}
		}
		// goes in until the roundOver bool is set to true
		results <- currentResult
		playerFirst = !playerFirst
	}
	return true
}

// creates units for the round which uses the cp to pick random stats the characters should use
func createUnitsForTheRound(cp int) team {
	var enemyTeam team
	enemyTeam.teamOwner = "enemy"
	rand.Seed(time.Now().UnixNano())
	var positionInColumn = 0
	var unitColumnNumber = 0
	for i := 0; i < 12; i++ {
		if positionInColumn == 4 {
			positionInColumn = 0
			unitColumnNumber++
		}
		newUnit := unit{
			unitID:        uuid.New().String(), // need to assign values
			health:        1 + rand.Intn(cp),
			attack:        1 + rand.Intn(cp),
			attackRange:   1 + rand.Intn(cp),
			specialStat1:  "",
			specialStat2:  "",
			yPosition:     1 + rand.Intn(cp),
			orderInColumn: positionInColumn,
			columnNumber:  unitColumnNumber,
			isAlive:       true,
		}
		if unitColumnNumber == 0 {
			enemyTeam.column1 = append(enemyTeam.column1, newUnit)
		}
		if unitColumnNumber == 1 {
			enemyTeam.column2 = append(enemyTeam.column2, newUnit)
		} else {
			enemyTeam.column3 = append(enemyTeam.column3, newUnit)
		}
		positionInColumn++
	}
	return enemyTeam
}

// performs one attack
func combat(attacker team, enemy team, roundTurns []turn) (bool, bool) {
	attacker1Found := false
	attacker2Found := false
	attacker3Found := false
	var attacker1 unit
	var attacker2 unit
	var attacker3 unit

	enemy1Found := false
	enemy2Found := false
	enemy3Found := false
	var enemy1 unit
	var enemy2 unit
	var enemy3 unit

	enemyCount := 3
	attackerCount := 3
	// found first attacker
	for i := 0; i < MaximumUnits; i++ {
		if !attacker1Found && attacker.column1[i].isAlive {
			attacker1 = attacker.column1[i]
			attacker1Found = true
			attackerCount--
		}
		if !attacker2Found && attacker.column2[i].isAlive {
			attacker2 = attacker.column2[i]
			attacker2Found = true
			attackerCount--
		}
		if !attacker3Found && attacker.column3[i].isAlive {
			attacker3 = attacker.column3[i]
			attacker3Found = true
			attackerCount--
		}
	}

	// found first enemy
	for i := 0; i < MaximumUnits; i++ {
		if !enemy1Found && enemy.column1[i].isAlive {
			enemy1 = enemy.column1[i]
			enemy1Found = true
			enemyCount--
		}
		if !enemy2Found && enemy.column1[i].isAlive {
			enemy2 = enemy.column1[i]
			enemy2Found = true
			enemyCount--
		}
		if !enemy3Found && enemy.column1[i].isAlive {
			enemy3 = enemy.column1[i]
			enemy3Found = true
			enemyCount--
		}
	}

	if (!attacker1Found || !enemy1Found) && (!attacker2Found || !enemy2Found) && (!attacker3Found || !enemy3Found) {
		if enemyCount > attackerCount {
			return true, true
		} else {
			return true, false

		}
	} else {

		// if the attacker is within attack range
		// we will need to add conditionals depending on the different special stats of a character
		// attack logic for column1
		var attacker1Turn turn
		if abs(attacker1.yPosition-enemy1.yPosition) <= attacker1.attackRange {
			enemy1.health = enemy1.health - attacker1.attack
			if enemy1.health <= 0 {
				enemy1.isAlive = false
			}
		} else {
			attacker1.yPosition++
		}
		var attackerRoundUnit, enemyRoundUnit = createRoundUnit(attacker1, enemy1)
		attacker1Turn.currentUnit = attackerRoundUnit
		attacker1Turn.targetUnit = enemyRoundUnit
		roundTurns = append(roundTurns, attacker1Turn)

		// attack logic for column2
		var attacker2Turn turn
		if abs(attacker2.yPosition-enemy2.yPosition) <= attacker2.attackRange {
			enemy2.health = enemy2.health - attacker2.attack
			if enemy2.health <= 0 {
				enemy2.isAlive = false
			}
		} else {
			attacker2.yPosition++
		}
		attackerRoundUnit, enemyRoundUnit = createRoundUnit(attacker2, enemy2)
		attacker2Turn.currentUnit = attackerRoundUnit
		attacker2Turn.targetUnit = enemyRoundUnit
		roundTurns = append(roundTurns, attacker2Turn)

		// attack logic for column3
		var attacker3Turn turn
		if abs(attacker3.yPosition-enemy3.yPosition) <= attacker3.attackRange {
			enemy3.health = enemy3.health - attacker3.attack
			if enemy3.health <= 0 {
				enemy3.isAlive = false
			}
		} else {
			attacker3.yPosition++
		}
		attackerRoundUnit, enemyRoundUnit = createRoundUnit(attacker3, enemy3)
		attacker3Turn.currentUnit = attackerRoundUnit
		attacker3Turn.targetUnit = enemyRoundUnit
		roundTurns = append(roundTurns, attacker3Turn)
	}
	return false, false
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func createRoundUnit(attacker unit, enemy unit) (roundUnit, roundUnit) {
	var attackerRoundUnit roundUnit
	attackerRoundUnit.unitID = attacker.unitID
	attackerRoundUnit.health = attacker.health
	attackerRoundUnit.attack = attacker.health

	var enemyRoundUnit roundUnit
	enemyRoundUnit.unitID = enemy.unitID
	enemyRoundUnit.health = enemy.health
	enemyRoundUnit.attack = enemy.health

	return attackerRoundUnit, enemyRoundUnit
}
