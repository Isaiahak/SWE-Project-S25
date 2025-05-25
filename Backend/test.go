package main

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"math/rand"
	"net/http"
	"sync"
	"time"
)

// struct for the lobby objects the server will contain a list of users
// i need to worry about this lobby implementation because if for some reason a user removes
// their userid from the cookies there slot in the lobby will forever be filled which can lead to complications

type Lobby struct {
	LobbyID           string
	LobbyState        bool
	GameID            string
	PlayerCount       int
	LobbyType         string
	PreferredLanguage string
	ChatID            string
	Difficulty        string
	HostID            *string
	Members           []*string
	UsedIDs           []bool
	UserNicknames     []*string
	UserIcons         []int
	ConnectedUsers    map[string]WebSocketInfo
}

type LobbyData struct {
	LobbyID       string
	LobbyState    bool
	GameID        string
	PlayerCount   int
	LobbyType     string
	Difficulty    string
	HostID        *string
	Members       []*string
	UsedIDs       []bool
	UserNicknames []*string
	UserIcons     []int
}

// splice of lobby structs containing initial lobbies
type LobbyManager struct {
	lobbies map[string]*Lobby
	mutex   sync.RWMutex
}

type WebSocketInfo struct {
	Connection  *websocket.Conn
	IsConnected bool
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all connections (consider restricting in production)
	},
}

var lobbyManager = &LobbyManager{
	lobbies: make(map[string]*Lobby),
}

// random nickname generator
func generateRandomNickname() string {
	adjectives := []string{"Swift", "Silent", "Clever", "Lucky", "Brave", "Sneaky", "Wild", "Funky"}
	nouns := []string{"Tiger", "Falcon", "Wizard", "Panda", "Ninja", "Pirate", "Knight", "Fox"}

	rand.Seed(time.Now().UnixNano())

	adj := adjectives[rand.Intn(len(adjectives))]
	noun := nouns[rand.Intn(len(nouns))]
	num := rand.Intn(1000)

	return fmt.Sprintf("%s%s%d", adj, noun, num)
}

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

	lobbyManager.mutex.RLock()
	var lobby = lobbyManager.lobbies[input.LobbyID]

	var lobbyType string
	if lobby.LobbyType == "public" {
		lobbyType = "private"
		lobby.LobbyType = lobbyType

	} else {
		lobbyType = "public"
		lobby.LobbyType = lobbyType
	}

	lobbyManager.mutex.RUnlock()

	broadcastLobbyUpdate(input.LobbyID)

	c.IndentedJSON(http.StatusOK, gin.H{
		"message": "changed the server type to: " + lobbyType,
	})
}

// get all of the public lobbies
func getLobbies(c *gin.Context) {
	var LobbiesInfo []LobbyData
	lobbyManager.mutex.RLock()
	for i := range lobbyManager.lobbies {
		if lobbyManager.lobbies[i].LobbyType == "public" && lobbyManager.lobbies[i].PlayerCount < 8 {
			LobbyData := LobbyData{
				LobbyID:       lobbyManager.lobbies[i].LobbyID,
				GameID:        lobbyManager.lobbies[i].GameID,
				PlayerCount:   lobbyManager.lobbies[i].PlayerCount,
				LobbyType:     lobbyManager.lobbies[i].LobbyType,
				Difficulty:    lobbyManager.lobbies[i].Difficulty,
				HostID:        lobbyManager.lobbies[i].HostID,
				Members:       lobbyManager.lobbies[i].Members,
				UsedIDs:       lobbyManager.lobbies[i].UsedIDs,
				UserNicknames: lobbyManager.lobbies[i].UserNicknames,
				UserIcons:     lobbyManager.lobbies[i].UserIcons,
			}
			LobbiesInfo = append(LobbiesInfo, LobbyData)
		}
	}

	lobbyManager.mutex.RUnlock()

	c.IndentedJSON(http.StatusOK, gin.H{
		"lobbies": LobbiesInfo,
	})
}

// leaves lobby if its a member closes lobby if its the host
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

	lobbyManager.mutex.RLock()
	var lobby = lobbyManager.lobbies[input.LobbyID]

	if input.UserID == *lobby.HostID {
		lobby.LobbyState = false
		lobbyManager.mutex.RUnlock()
		broadcastLobbyUpdate(input.LobbyID)

		lobbyManager.mutex.RLock()
		for userid := range lobby.ConnectedUsers {
			var socket = lobby.ConnectedUsers[userid]
			socket.Connection.Close()
			delete(lobby.ConnectedUsers, userid)
		}

		delete(lobbyManager.lobbies, input.LobbyID)
		lobbyManager.mutex.RUnlock()

		c.IndentedJSON(http.StatusOK, gin.H{
			"result":  true,
			"message": "server has been closed",
		})
	} else {
		for i := 0; i < 8; i++ {

			if input.UserID == *lobby.Members[i] {
				lobby.UsedIDs[i] = false
				newNickname := generateRandomNickname()
				lobby.UserNicknames[i] = &newNickname
				lobby.UserIcons[i] = i
				var socket = lobby.ConnectedUsers[input.UserID]
				socket.Connection.Close()
				delete(lobby.ConnectedUsers, input.UserID)
			}
		}

		lobby.PlayerCount = lobby.PlayerCount - 1

		lobbyManager.mutex.RUnlock()

		broadcastLobbyUpdate(input.LobbyID)

		c.IndentedJSON(http.StatusOK, gin.H{
			"result":  true,
			"message": "lefted lobby",
		})
	}
}

// joins a lobby
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
	lobbyManager.mutex.RLock()
	lobby, ok := lobbyManager.lobbies[input.LobbyID]

	if ok {
		var availableID string
		var full bool
		for i := 0; i < 8; i++ {
			if lobby.UsedIDs[i] == false {
				availableID = *lobby.Members[i]
				lobby.UsedIDs[i] = true
				full = false
				break
			} else {
				full = true
			}
		}
		if full == true {
			lobbyManager.mutex.RUnlock()
			c.IndentedJSON(http.StatusOK, gin.H{
				"result":  false,
				"message": "lobby full",
			})
		} else {
			lobby.PlayerCount = lobby.PlayerCount + 1
			lobbyManager.mutex.RUnlock()

			broadcastLobbyUpdate(input.LobbyID)

			c.IndentedJSON(http.StatusCreated, gin.H{
				"result":   true,
				"message":  "joined lobby",
				"user_id":  availableID, // fill with user id from lobby
				"lobby_id": input.LobbyID,
			})
		}
	} else {
		lobbyManager.mutex.RUnlock()
		c.IndentedJSON(http.StatusOK, gin.H{
			"result":  false,
			"message": "invalid lobby id",
		})
	}

}

// joins a random lobby
func JoinRandomLobby(c *gin.Context) {
	lobbyManager.mutex.RLock()
	if len(lobbyManager.lobbies) == 0 {
		lobbyManager.mutex.RUnlock()
		c.IndentedJSON(http.StatusOK, gin.H{
			"result":  false,
			"message": "no current game lobbyManager.lobbies",
		})
	} else {
		var RandomLobby Lobby
		RandomLobby.LobbyID = "empty"
		for i := range lobbyManager.lobbies {
			if lobbyManager.lobbies[i].PlayerCount != 8 {
				RandomLobby = *lobbyManager.lobbies[i]
				break
			}
		}
		lobbyManager.mutex.RUnlock()
		if RandomLobby.LobbyID == "empty" {
			c.IndentedJSON(http.StatusOK, gin.H{
				"result":  false,
				"message": "All current lobbies are full",
			})
		} else {
			RandomLobby.PlayerCount = RandomLobby.PlayerCount + 1
			var availableID string
			for i := 0; i < 8; i++ {
				if RandomLobby.UsedIDs[i] == false {
					availableID = *RandomLobby.Members[i]
					RandomLobby.UsedIDs[i] = true
				}
			}
			var lobbyID = RandomLobby.LobbyID

			lobbyManager.mutex.RUnlock()

			broadcastLobbyUpdate(lobbyID)

			c.IndentedJSON(http.StatusOK, gin.H{
				"result":   true,
				"lobby_id": lobbyID,
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
	UserNickname := make([]*string, 0, 8)
	UserIcons := make([]int, 0, 8)
	for i := 0; i < 8; i++ {
		userID := uuid.New().String()
		Members_list = append(Members_list, &userID)
		UsedIDs_list = append(UsedIDs_list, false)
		nickname := generateRandomNickname()
		UserNickname = append(UserNickname, &nickname)
		UserIcons = append(UserIcons, i)
	}

	newLobby := Lobby{
		LobbyID:           lobbyID,
		LobbyState:        true,
		GameID:            input.GameID,
		PlayerCount:       1,
		LobbyType:         "public",
		PreferredLanguage: "english",
		ChatID:            "",
		Difficulty:        "normal",
		HostID:            Members_list[0],
		Members:           Members_list,
		UsedIDs:           UsedIDs_list,
		UserNicknames:     UserNickname,
		UserIcons:         UserIcons,
	}
	// after we set the host to the first id we set the first usedid bool to true
	UsedIDs_list[0] = true
	//saving the pointers of the new lobbies
	lobbyManager.mutex.Lock()
	lobbyManager.lobbies[lobbyID] = &newLobby
	lobbyManager.mutex.Unlock()

	broadcastLobbyUpdate(lobbyID)

	c.IndentedJSON(http.StatusCreated, gin.H{
		"message":  "created lobby",
		"lobby_id": newLobby.LobbyID,
		"user_id":  *newLobby.HostID,
	})
}

// gets the lobby information for a specific lobby
func getLobbyInfo(c *gin.Context) {
	var input struct {
		LobbyID string `json:"lobby_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	lobbyManager.mutex.RLock()
	lobby := lobbyManager.lobbies[input.LobbyID]

	LobbyData := LobbyData{
		LobbyID:       lobby.LobbyID,
		GameID:        lobby.GameID,
		PlayerCount:   lobby.PlayerCount,
		LobbyType:     lobby.LobbyType,
		Difficulty:    lobby.Difficulty,
		HostID:        lobby.HostID,
		Members:       lobby.Members,
		UsedIDs:       lobby.UsedIDs,
		UserNicknames: lobby.UserNicknames,
		UserIcons:     lobby.UserIcons,
	}

	lobbyManager.mutex.RUnlock()

	c.IndentedJSON(http.StatusOK, gin.H{
		"lobby": LobbyData,
	})
}

// changes user nickname
func changeUserNickname(c *gin.Context) {
	var input struct {
		LobbyID      string `json:"lobby_id" binding:"required"`
		UserID       string `json:"user_id" binding:"required"`
		UserNickname string `json:"user_nickname" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"result": "false",
			"error":  err.Error(),
		})
	}

	lobbyManager.mutex.RLock()
	lobby := lobbyManager.lobbies[input.LobbyID]
	for i := 0; i < 8; i++ {
		if input.UserID == *lobby.Members[i] {
			lobby.UserNicknames[i] = &input.UserNickname
		}
	}

	lobbyManager.mutex.RUnlock()

	broadcastLobbyUpdate(input.LobbyID)

	c.IndentedJSON(http.StatusOK, gin.H{
		"result": "true",
	})

}

// changes user icon
func changeUserIcon(c *gin.Context) {
	var input struct {
		LobbyID  string `json:"lobby_id" binding:"required"`
		UserID   string `json:"user_id" binding:"required"`
		UserIcon int    `json:"user_icon" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"result": "false",
			"error":  err.Error(),
		})
	}

	lobbyManager.mutex.RLock()
	lobby := lobbyManager.lobbies[input.LobbyID]
	for i := 0; i < 8; i++ {
		if input.UserID == *lobby.Members[i] {
			lobby.UserIcons[i] = input.UserIcon
		}
	}

	lobbyManager.mutex.RUnlock()

	broadcastLobbyUpdate(input.LobbyID)

	c.IndentedJSON(http.StatusOK, gin.H{
		"result": "true",
	})
}

// creates the websocket connecting the client frontend
func webSocketHandler(c *gin.Context) {
	lobbyID := c.Param("lobby_id")
	userID := c.Query("user_id")

	// Check if lobby exists
	lobbyManager.mutex.RLock()
	lobby, exists := lobbyManager.lobbies[lobbyID]

	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Lobby not found"})
		return
	}

	var result = true
	for i := 0; i < 8; i++ {
		if *lobby.Members[i] == userID {
			result = false
		}
	}

	if result {
		c.JSON(http.StatusForbidden, gin.H{"error": "Player not in lobby"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "WebSocket upgrade failed"})
		return
	}

	if lobby.ConnectedUsers == nil {
		lobby.ConnectedUsers = make(map[string]WebSocketInfo)
	}
	socketInfo := WebSocketInfo{
		Connection:  conn,
		IsConnected: true,
	}

	lobby.ConnectedUsers[userID] = socketInfo

	lobbyManager.mutex.RUnlock()

	sendLobbyState(conn, lobby)

	defer func() {
		conn.Close()
		lobbyManager.mutex.RLock()
		delete(lobby.ConnectedUsers, userID)
		lobbyManager.mutex.RUnlock()
	}()

	// Keep the connection alive
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}
}

func broadcastLobbyUpdate(lobbyID string) {
	lobbyManager.mutex.RLock()
	lobby, exists := lobbyManager.lobbies[lobbyID]

	if !exists {
		return
	}

	LobbyData := LobbyData{
		LobbyID:       lobby.LobbyID,
		LobbyState:    lobby.LobbyState,
		GameID:        lobby.GameID,
		PlayerCount:   lobby.PlayerCount,
		LobbyType:     lobby.LobbyType,
		Difficulty:    lobby.Difficulty,
		HostID:        lobby.HostID,
		Members:       lobby.Members,
		UsedIDs:       lobby.UsedIDs,
		UserNicknames: lobby.UserNicknames,
		UserIcons:     lobby.UserIcons,
	}

	lobbyData := gin.H{
		"lobby": LobbyData,
	}

	for userid := range lobby.ConnectedUsers {
		var socket = lobby.ConnectedUsers[userid]
		socket.Connection.WriteJSON(lobbyData)
	}
	lobbyManager.mutex.RUnlock()
}

func sendLobbyState(conn *websocket.Conn, lobby *Lobby) {
	lobbyManager.mutex.RLock()
	LobbyData := LobbyData{
		LobbyID:       lobby.LobbyID,
		LobbyState:    lobby.LobbyState,
		GameID:        lobby.GameID,
		PlayerCount:   lobby.PlayerCount,
		LobbyType:     lobby.LobbyType,
		Difficulty:    lobby.Difficulty,
		HostID:        lobby.HostID,
		Members:       lobby.Members,
		UsedIDs:       lobby.UsedIDs,
		UserNicknames: lobby.UserNicknames,
		UserIcons:     lobby.UserIcons,
	}
	lobbyManager.mutex.RUnlock()

	lobbyData := gin.H{
		"lobby": LobbyData,
	}

	conn.WriteJSON(lobbyData)
}

func main() {
	router := gin.Default()
	router.Use(cors.Default())
	router.GET("/lobbies", getLobbies)
	router.GET("/join-random", JoinRandomLobby)
	router.GET("/get-lobby-info", getLobbyInfo)
	router.POST("/change-icon", changeUserIcon)
	router.POST("/change-nickname", changeUserNickname)
	router.POST("/create-lobby", createLobby)
	router.POST("/join-lobby", joinLobby)
	router.POST("/change-lobby-type", changeLobbyType)
	router.POST("/leave-lobby", leaveLobby)
	router.GET("/ws/lobby/:lobby_id", webSocketHandler)

	router.Run("localhost:8080")
}
