import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { JoinLobby } from '../services/LobbyServices'


export default function URLJoin(){
	const {code} = useParams()
	const navigate = useNavigate()
	const didJoin = useRef(false)

	useEffect(()=>{
		const handleJoin = async () =>{

			if (code && !didJoin.current){
				didJoin.current = true
				await JoinLobby(code,navigate)
			}
		}
		handleJoin()
	},[code,navigate])

	return(
		<h1>Joining Lobby...</h1>
	)
}