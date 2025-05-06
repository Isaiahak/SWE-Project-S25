package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
)

// struct for the lobby objects the server will contain
type lobby struct {
	ID          string `json:id`
	GameID      string `json:game_id`
	PlayerCount int32  `json:player_count`
}

type user struct {
	UserID   string `json:user_id`
	UserName string `json:user_name`
}

// list of users
var users = make(map[string]user)

// splice of lobby structs containing initial lobbies
var lobbies = make(map[string]lobby)

func getLobbies(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, lobbies)
}

func createLobby(c *gin.Context) {
	var input struct {
		GameID string `json:"game_id" binding:"required"`
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
		ID:          lobbyID,
		GameID:      input.GameID,
		PlayerCount: 1,
	}
	lobbies[lobbyID] = newLobby

	//creates an instance of the user who created the lobby
	userID := uuid.New().String()
	newUser := user{
		UserID:   userID,
		UserName: "newUser",
	}
	users[userID] = newUser

	c.IndentedJSON(http.StatusCreated, gin.H{
		"message": "created user and lobby",
		"user":    newUser,
		"lobby":   newLobby,
	})

}

func main() {
	router := gin.Default()
	router.Use(cors.Default())
	router.GET("/lobbies", getLobbies)
	router.POST("/create-lobby", createLobby)
	router.Run("localhost:8080")
}
