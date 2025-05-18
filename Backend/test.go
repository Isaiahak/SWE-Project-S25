package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"log"
	"net/http"
)

// struct for the lobby objects the server will contain a list of users
// i need to worry about this lobby implementation becasue if for some reason a user removes
// their userid from the cookies there slot in the lobby will forever be filled which can lead to complications

type Lobby struct {
	LobbyID           string    `json:id`
	GameID            string    `json:game_id`
	PlayerCount       int32     `json:player_count`
	LobbyType         string    `json:lobby_type`
	PreferredLanguage string    `json:language`
	ChatID            string    `json:chat_id`
	Difficulty        string    `json:difficulty`
	HostID            *string   `json:host_id`
	Members           []*string `json:members`
	UsedIDs           []bool    `json:usedIDs`
}

// splice of lobby structs containing initial lobbies
var lobbies = make(map[string]*Lobby)

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
	var LobbiesInfo []Lobby
	for i := range lobbies {
		if lobbies[i].LobbyType == "public" {
			LobbiesInfo = append(LobbiesInfo, *lobbies[i])
		}
	}
	c.IndentedJSON(http.StatusOK, gin.H{
		"lobbies": LobbiesInfo,
	})

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

	if input.UserID == *lobbies[input.LobbyID].HostID {
		delete(lobbies, input.LobbyID)
		c.IndentedJSON(http.StatusOK, gin.H{
			"message": "server has been closed",
		})
	} else {
		c.IndentedJSON(http.StatusBadRequest, gin.H{
			"message": "non-host members cannot close server",
		})
	}
}

// leaves lobby is a frontend side task which should remove the
func leaveLobby(c *gin.Context) {
	var input struct {
		LobbyID string `json:"lobby_id" binding:"required"`
		UserID  string `json:"user_id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	// we have two cases the host is leaving or a non host
	if input.UserID == *lobbies[input.LobbyID].HostID {
		delete(lobbies, input.LobbyID)
		c.IndentedJSON(http.StatusOK, gin.H{
			"message": "server has been closed",
		})
	} else {
		for i := 0; i < 8; i++ {
			if input.UserID == *lobbies[input.LobbyID].Members[i] {
				lobbies[input.LobbyID].UsedIDs[i] = false
			}
		}
		lobbies[input.LobbyID].PlayerCount = lobbies[input.LobbyID].PlayerCount - 1
		c.IndentedJSON(http.StatusOK, gin.H{
			"message": "lefted lobby",
			"lobby":   input.LobbyID,
		})
	}
}

// joins a lobby and creates a user if required
func joinLobby(c *gin.Context) {
	var input struct {
		LobbyID string `json:"lobby_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	_, ok := lobbies[input.LobbyID]
	if ok {
		var availableID string
		var full bool
		for i := 0; i < 8; i++ {
			if lobbies[input.LobbyID].UsedIDs[i] == false {
				availableID = *lobbies[input.LobbyID].Members[i]
				lobbies[input.LobbyID].UsedIDs[i] = true
				full = false
			} else {
				full = true
			}
		}
		if full == true {
			c.IndentedJSON(http.StatusCreated, gin.H{
				"message": "lobby full",
			})
		} else {
			lobbies[input.LobbyID].PlayerCount = lobbies[input.LobbyID].PlayerCount + 1
			c.IndentedJSON(http.StatusCreated, gin.H{
				"message":  "joined lobby",
				"user_id":  availableID, // fill with user id from lobby
				"lobby_id": input.LobbyID,
			})
		}
	} else {
		c.IndentedJSON(http.StatusBadRequest, gin.H{
			"message": "invalid lobby id",
		})
	}

}

func JoinRandomLobby(c *gin.Context) {
	if len(lobbies) == 0 {
		c.IndentedJSON(http.StatusBadRequest, gin.H{
			"message": "no current game lobbies",
		})
	} else {
		var RandomLobby Lobby
		RandomLobby.LobbyID = "empty"
		for i := range lobbies {
			if lobbies[i].PlayerCount != 8 {
				RandomLobby = *lobbies[i]
				break
			}
		}
		if RandomLobby.LobbyID == "empty" {
			c.IndentedJSON(http.StatusBadRequest, gin.H{
				"message": "All current lobbies are full",
			})
		} else {
			lobbies[RandomLobby.LobbyID].PlayerCount = lobbies[RandomLobby.LobbyID].PlayerCount + 1
			var availableID string
			for i := 0; i < 8; i++ {
				if lobbies[RandomLobby.LobbyID].UsedIDs[i] == false {
					availableID = *lobbies[RandomLobby.LobbyID].Members[i]
					lobbies[RandomLobby.LobbyID].UsedIDs[i] = true
				}
			}
			c.IndentedJSON(http.StatusOK, gin.H{
				"lobby_id": RandomLobby.LobbyID,
				"user_id":  availableID,
			})
		}

	}
}

// creates a public lobby and creates a user if required
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

	//creates a slice of userid pointers for the lobby
	// and creates a slice of bools which represent which userids are being used
	UsedIDs_list := make([]bool, 0, 8)
	Members_list := make([]*string, 0, 8)
	for i := 0; i < 8; i++ {
		userID := uuid.New().String()
		Members_list = append(Members_list, &userID)
		UsedIDs_list = append(UsedIDs_list, false)
	}

	newLobby := Lobby{
		LobbyID:           lobbyID,
		GameID:            input.GameID,
		PlayerCount:       1,
		LobbyType:         "public",
		PreferredLanguage: "english",
		ChatID:            "",
		Difficulty:        "normal",
		HostID:            Members_list[0],
		Members:           Members_list,
		UsedIDs:           UsedIDs_list,
	}
	// after we set the host to the first id we set the first usedid bool to true
	UsedIDs_list[0] = true
	//saving the pointers of the new lobbies
	lobbies[lobbyID] = &newLobby

	log.Println("the amount of lobbies is: ", len(lobbies))
	log.Println("game id is: ", input.GameID)

	c.IndentedJSON(http.StatusCreated, gin.H{
		"message":  "created lobby",
		"lobby_id": newLobby.LobbyID,
		"user_id":  *newLobby.HostID,
	})
}

func main() {
	router := gin.Default()
	router.Use(cors.Default())
	router.GET("/lobbies", getLobbies)
	router.GET("//join-random", JoinRandomLobby)
	router.POST("/create-lobby", createLobby)
	router.POST("/join-lobby", joinLobby)
	router.POST("/close-lobby", closeLobby)
	router.POST("/change-lobby-type", changeLobbyType)
	router.POST("/leave-lobby", leaveLobby)

	router.Run("localhost:8080")
}
