export default function LobbyCode({code}){

	const frontend_url = import.meta.env.VITE_FRONTEND_URL 
	const lobbyCode = `${frontend_url}/join/${code}`

	const copyIcon = async () => {
		try{
			await navigator.clipboard.writeText(lobbyCode)
		}
		catch(error){
			console.error('Failed to copy lobbyCode', error)
		}
	}
	return(
	<div className="relative flex flex-row p-5 rounded-xl gap-6 items-center justify-center">
		<div className="font-semibold text-black">
			<h1>Copy Lobby URL</h1>
		</div>
		<div className=" bg-primary rounded-md hover:scale-110 ease-in-out duration-325 " onClick={copyIcon}>
			<img src="/copy-icon.png" alt="copy"/>
		</div>
	</div>
	)
}