import GameBar from './GameBar.tsx'
import SideBar from './SideBar.tsx'
import GameProvider from './GameProvider.tsx'


function MainPage(){
	return(	
		<div className="mainpage-container">
			<GameProvider>
				<SideBar/>
				<div className="main-container">	
					<GameBar/>
				</div>
			</GameProvider>
		</div>
	)
}

export default MainPage