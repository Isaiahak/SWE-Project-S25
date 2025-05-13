import axios from 'axios'
import Cookies from 'js-cookie'

const backend_url = import.meta.env.VITE_BACKEND_URL


export const CreateLobby = async (game,navigate) =>{
	try{
		if (game != undefined){	
			console.log('this is the value of game',game)
			const res = await axios.post(`${backend_url}/create-lobby`,{game_id: `${game}`})
			console.log('message after create attempt', res.data.message)
			Cookies.set('user_id',res.data.user_id)
			Cookies.set('lobby_id', res.data.lobby_id)
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
			console.log('this is thew value of the lobby',lobby)
			const res = await axios.post(`${backend_url}/join-lobby`,{lobby_id: `${lobby}`})
			console.log('message after join attempt ', res.data.message)
			Cookies.set('user_id', res.data.user_id)
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
		const res = await axios.post(`${backend_url}/leave-lobby`,{user_id: `${user_id}`, lobby_id: `${lobby_id}`})
		console.log('message after attempting to leave', res.data.message)
		Cookies.remove('user_id')
		Cookies.remove('lobby_id')
		navigate('/')
	}
	catch(error){
		console.error("didn't leave lobby",error)
	}
}


 