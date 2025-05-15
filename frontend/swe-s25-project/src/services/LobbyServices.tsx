import axios from 'axios'
import Cookies from 'js-cookie'

const backend_url = import.meta.env.VITE_BACKEND_URL


export const CreateLobby = async (game,navigate) =>{
	try{
		if (game != undefined){	
			const res = await axios.post(`${backend_url}/create-lobby`,{game_id: `${game}`})
			//Cookies.set('user_id',res.data.user_id)
			sessionStorage.setItem('user_id',res.data.user_id)
			//Cookies.set('lobby_id', res.data.lobby_id)
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
			//Cookies.set('user_id', res.data.user_id)
			sessionStorage.setItem('user_id', res.data.user_id)
			sessionStorage.setItem('lobby_id',lobby)
			navigate('/Lobby')
		}
	}
	catch(error){
		console.error("didn't join lobby",error)
	}
}

export const LeaveLobby = async (navigate) =>{
	try{
		const user_id = Cookies.get("user_id")
		const lobby_id = Cookies.get("lobby_id")
		await axios.post(`${backend_url}/leave-lobby`,{user_id: `${user_id}`, lobby_id: `${lobby_id}`})
		//Cookies.remove('user_id')
		//Cookies.remove('lobby_id')
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
