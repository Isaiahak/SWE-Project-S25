import '../styling/SideBar.css'
import axios from 'axios'
import useGameContext from './useGameContext.tsx'
import Cookies from 'js-cookie'



function SideBar(){
	const {game} = useGameContext()
	const backend_url = import.meta.env.VITE_BACKEND_URL

	const CreateLobby = async () =>{
		try{
			const userid = Cookies.get('userid')
			console.log("this is the userid: ",useid)
			if (!userid){
				console.log("hello")	
			}
			const res = await axios.post(`${backend_url}/create-lobby`,{game_id: `${game}`})
			console.log("server response: ", res.data.user)
		}
		catch(error){
			// maybe have a retry
			console.error("didn't get a lobby",error)
		}
	}

	return(
		<div className='sidebar-container'>
		<div className='main-buttons'>	
			<button className="play-button-container">PLAY</button>
			<button className="create-button-container" onClick={CreateLobby}>CREATE</button>
			<button className="join-button-container">JOIN</button>
			<button className="friend-button-container">FRIENDS</button>
		</div>
			<div className="account-options-container">
				<button className="profile-button"></button>
				<button className="settings-button"></button>
				<button className="info-button"></button>
			</div>
		</div>
	)
}

export default SideBar