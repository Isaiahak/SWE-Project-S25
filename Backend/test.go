package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"log"
	"net/http"
)

// struct for the lobby objects the server will contain
type lobby struct {
	LobbyID          string `json:id`
	GameID      string `json:game_id`
	PlayerCount int32  `json:player_count`
	LobbyType string `json:lobby_type`
	PreferredLanguage string `json:language`
	ChatID string `json:chat_id`
	Difficulty string `json:difficulty`

}

type user struct {
	UserID   string `json:user_id`
	UserName string `json:user_name`
}

// list of users
var users = make(map[string]*user)

// splice of lobby structs containing initial lobbies
var lobbies = make(map[string]*lobby)

// map of lobby pairs
var lobbyMembers = make(map[string][]*user)


func getLobbies(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, lobbies)
}

func joinLobby(c *gin.Context){

}

func createLobby(c *gin.Context) {
	var input struct {
		GameID     string `json:"game_id" binding:"required"`
		UserID     string `json:"user_id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// creates a instance of a lobby for the user
	lobbyID := uuid.New().String()
	newLobby := lobby{
		LobbyID:          lobbyID,
		GameID:      input.GameID,
		PlayerCount: 1,
	}
	//saving the pointers of the new lobbies
	lobbies[&lobbyID] = &newLobby

	log.Println("does the current user exists: ", input.UserExists)
	log.Println("the amount of users is: 4", len(users))
	log.Println("the amount of lobbies is: ", len(lobbies))
	log.Println("game id is: ", input.GameID)

	if input.UserID == "" {
		userID := uuid.New().String()
		newUser := user{
			UserID:   userID,
			UserName: "new User",
		}
		//saving the pointer of the user
		users[&userID] = &newUser
		lobbyMembers[lobbyID] = append(userID)
		c.IndentedJSON(http.StatusCreated, gin.H{
			"message": "created user and lobby",
			"user":    newUser,
			"lobby":   newLobby,
		})
	} else {
		lobbyMembers[lobbyID] = append(input.UserID)
		c.IndentedJSON(http.StatusCreated, gin.H{
			"message": "created lobby",
			"lobby":   newLobby,
		})
	}

}

func main() {
	router := gin.Default()
	router.Use(cors.Default())
	router.GET("/lobbies", getLobbies)
	router.POST("/create-lobby", createLobby)
	router.Run("localhost:8080")
}
