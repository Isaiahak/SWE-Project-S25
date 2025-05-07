import ActionButton from "./ActionButton";

export default function Sidebar() {
	const {game} = useGameContext()
	const backend_url = import.meta.env.VITE_BACKEND_URL

	const CreateLobby = async () =>{
		try{
			const user = Cookies.get('user')
			const res = await axios.post(`${backend_url}/create-lobby`,{game_id: `${game}`,user: user })
			console.log(res.data)
			if (userExists == "false"){
				Cookies.set('user',res.data.user)
			}

		}
		catch(error){
			// maybe have a retry
			console.error("didn't get a lobby",error)
		}
	}
  return (
    <nav className="h-screen w-80 flex flex-col justify-between bg-sidebar-primary shadow-lg">
      <div className="flex flex-col">
        <h1 className="text-center font-[Bebas Neue] font-bold text-[2rem]">
          Aken Studios
        </h1>
        <ActionButton label="PLAY"/>
        <ActionButton label onClick={CreateLobby}="CREATE" />
        <ActionButton label="JOIN" />
        <ActionButton label="FRIENDS" />
      </div>
    </nav>
  );
}
