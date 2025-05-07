package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"log"
	"net/http"
)

// struct for the lobby objects the server will contain
type Lobby struct {
	LobbyID           string  `json:id`
	GameID            string  `json:game_id`
	PlayerCount       int32   `json:player_count`
	LobbyType         string  `json:lobby_type`
	PreferredLanguage string  `json:language`
	ChatID            string  `json:chat_id`
	Difficulty        string  `json:difficulty`
	HostID            *string `json:host_id`
}

type User struct {
	UserID   string `json:user_id`
	UserName string `json:user_name`
}

// list of users
var users = make(map[string]*User)

// splice of lobby structs containing initial lobbies
var lobbies = make(map[string]*Lobby)

// map of lobby pairs
var lobbyMembers = make(map[string][]*User)

// changes the lobby type from public to private and vice versa
func changeLobbyType(c *gin.Context) {
	var input struct {
		LobbyID string `json:"lobby_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	if lobbies[input.LobbyID].LobbyType == "public" {
		lobbies[input.LobbyID].LobbyType = "private"
	} else {
		lobbies[input.LobbyID].LobbyType = "public"
	}
	c.IndentedJSON(http.StatusOK, gin.H{
		"message": "changed the server type to: " + lobbies[input.LobbyID].LobbyType,
	})
}

// get all of the public lobbies
func getLobbies(c *gin.Context) {
	var lobbiesInfo = make([]Lobby, len(lobbies))
	for i := range lobbies {
		if lobbies[i].LobbyType == "public" {
			lobbiesInfo = append(lobbiesInfo, *lobbies[i])
		}
	}
	c.IndentedJSON(http.StatusOK, lobbiesInfo)
}

func closeLobby(c *gin.Context) {
	var input struct {
		LobbyID string `json:"lobby_id" binding:"required"`
		UserID  string `json:"user_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	// remove all members from the lobby
	delete(lobbyMembers, input.LobbyID)
	// reroute the members to main page
	delete(lobbies, input.LobbyID)
}

// leaves a
func leaveLobby(c *gin.Context) {
	var input struct {
		LobbyID string `json:"game_id" binding:"required"`
		User    User   `json:"user"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	for i := 0; i < len(lobbyMembers[input.LobbyID]); i++ {
		if lobbyMembers[input.LobbyID][i].UserID == input.User.UserID {
			lobbyMembers[input.LobbyID] = append(lobbyMembers[input.LobbyID][:i], lobbyMembers[input.LobbyID][i+1:]...)
		}
	}
	c.IndentedJSON(http.StatusOK, gin.H{
		"message": "lefted lobby",
		"lobby":   input.LobbyID,
	})
}

// joins a lobby and creates a user if required
func joinLobby(c *gin.Context) {
	var input struct {
		LobbyID string `json:"game_id" binding:"required"`
		User    user   `json:"user"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	if input.User.UserID == "" {
		userID := uuid.New().String()
		newUser := user{
			UserID:   userID,
			UserName: "NewUser",
		}
		users[userID] = &newUser
		lobbyMembers[input.LobbyID] = append(lobbyMembers[input.LobbyID], &newUser)
		c.IndentedJSON(http.StatusCreated, gin.H{
			"message": "created user and joined lobby",
			"user":    newUser,
			"lobby":   input.LobbyID,
		})
	} else {
		lobbyMembers[input.LobbyID] = append(lobbyMembers[input.LobbyID], &input.User)
		c.IndentedJSON(http.StatusCreated, gin.H{
			"message": "joined lobby",
			"user":    input.User,
			"lobby":   input.LobbyID,
		})
	}
}

// creates a public lobby and creates a user if required
func createLobby(c *gin.Context) {
	var input struct {
		GameID string `json:"game_id" binding:"required"`
		// we might want to add the lobby_type here
		User User `json:"user"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// creates a instance of a lobby for the user
	lobbyID := uuid.New().String()
	newLobby := Lobby{
		LobbyID:           lobbyID,
		GameID:            input.GameID,
		PlayerCount:       1,
		LobbyType:         "public",
		PreferredLanguage: "english",
		ChatID:            "",
		Difficulty:        "normal",
		HostID:            nil,
	}
	//saving the pointers of the new lobbies
	lobbies[lobbyID] = &newLobby

	log.Println("the amount of users is: 4", len(users))
	log.Println("the amount of lobbies is: ", len(lobbies))
	log.Println("game id is: ", input.GameID)

	if input.User.UserID == "" {
		userID := uuid.New().String()
		newUser := User{
			UserID:   userID,
			UserName: "new User",
		}
		lobbies[lobbyID].HostID = &userID
		//saving the pointer of the user
		users[userID] = &newUser
		lobbyMembers[lobbyID] = append(lobbyMembers[lobbyID], &newUser)
		c.IndentedJSON(http.StatusCreated, gin.H{
			"message": "created user and lobby",
			"user":    newUser,
			"lobby":   newLobby,
		})
	} else {
		lobbies[lobbyID].HostID = &users[input.User.UserID].UserID
		lobbyMembers[lobbyID] = append(lobbyMembers[lobbyID], &input.User)
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
	router.POST("/join-lobby", joinLobby)
	router.POST("/close-lobby", closeLobby)
	router.POST("/change-lobby-type", changeLobbyType)
	router.POST("/leave-lobby", leaveLobby)

	router.Run("localhost:8080")
}
