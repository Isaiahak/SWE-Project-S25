import axios from 'axios'

const backend_url = import.meta.env.VITE_BACKEND_URL


export const CreateLobby = async (game,navigate) =>{
	try{
		if (game != undefined){	
			const res = await axios.post(`${backend_url}/create-lobby`,{game_id: `${game}`})
			sessionStorage.setItem('user_id',res.data.user_id)
			sessionStorage.setItem('lobby_id', res.data.lobby_id)
			navigate('/Lobby')
		}
	}
	catch(error){
		console.error("didn't create a lobby",error)
	}
}

export const JoinLobby = async (lobby,navigate) =>{
	try{
		if (lobby != ''){
			const res = await axios.post(`${backend_url}/join-lobby`,{lobby_id: `${lobby}`})
			sessionStorage.setItem('user_id', res.data.user_id)
			sessionStorage.setItem('lobby_id',lobby)
			console.log(sessionStorage.getItem('user_id'))
			navigate('/Lobby')
		}
	}
	catch(error){
		console.error("didn't join lobby",error)
	}
}

export const LeaveLobby = async (navigate) =>{
	try{
		const user_id = sessionStorage.getItem("user_id")
		const lobby_id = sessionStorage.getItem("lobby_id")

		if (!user_id || !lobby_id) {
			console.error("Missing user_id or lobby_id in session storage")
			sessionStorage.removeItem('user_id')
			sessionStorage.removeItem('lobby_id')
			navigate('/')
			return;
		}

		await axios.post(`${backend_url}/leave-lobby`,{user_id: `${user_id}`, lobby_id: `${lobby_id}`})
		sessionStorage.removeItem('user_id');
		sessionStorage.removeItem('lobby_id');
		navigate('/')
	}
	catch(error){
		console.error("didn't leave lobby",error)
	}
}

export const GetLobbies = async () => {
	try{
		const res =  await axios.get(`${backend_url}/lobbies`)
		const lobbies = res.data.lobbies
		return lobbies
	}
	catch(error){
		console.error("didn't get lobbies",error)
	}
 }

export const GetRandomLobby = async (navigate) => {
	try{

		const res = await axios.get(`${backend_url}/join-random`)
		if (res.data.result == true){
			sessionStorage.setItem('user_id', res.data.user_id)
			sessionStorage.setItem('lobby_id',res.data.lobby_id)
			navigate('/Lobby')
			return true				
		}else{
			return false
		}
	}
	catch(error){
		console.error("couldn't find a random lobby",error)
	}
}

export const GetLobbyInfo = async () => {
	try{
		if (!lobby_id) {
			throw new Error("No lobby_id in session storage");
		}
		const res = await axios.get(`${backend_url}/get-lobby-info`)
		return res.data.lobby
	}
	catch(error){
		console.error("couldn't get lobby information",error)
	}
}

export const ChangeIcon = async (userIcon) => {
	try{
		const user_id = sessionStorage.getItem('user_id');
		const lobby_id = sessionStorage.getItem('lobby_id');
		if (!user_id || !lobby_id) {
			throw new Error("Missing user_id or lobby_id in session storage");
		}	
		await axios.post(`${backend_url}/change-icon`,{user_id:`${user_id}`, lobby_id:`${lobby_id}`, user_icon:userIcon})	
	}	
	catch(error){
		console.error("couldn't change the icon",error)
	}
}

export const ChangeNickname = async (userNickname) => {
	try{
		const user_id = sessionStorage.getItem('user_id')
		const lobby_id = sessionStorage.getItem('lobby_id')
		if (!user_id || !lobby_id) {
			throw new Error("Missing user_id or lobby_id in session storage")
		}
		if (userNickname != ''){
			await axios.post(`${backend_url}/change-nickname`,{ user_id:`${user_id}`, lobby_id:`${lobby_id}`, user_nickname:`${userNickname}`})
		}else{
			throw new Error("Need to add a valid nickname")
		}

	}
	catch(error){
		console.error("couldn't change the nickname",error)
	}
}

export const ChangeLobbyType = async () => {
	try{
		const lobby_id = sessionStorage.getItem('lobby_id')
		if (!lobby_id) {
			throw new Error("No lobby_id in session storage")
		}
		await axios.post(`${backend_url}/change-lobby-type`,lobby_id)
	}
	catch(error){
		console.error("couldn't change lobby type",error)
	}
}

export const StartGame = async() =>{

}