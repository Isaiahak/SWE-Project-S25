import Sidebar from './components/SideBar'
import MainUI from './components/MainUI'
import useDisconnectedUser from './hooks/DisconnectedUser'



export default function App() {
  useDisconnectedUser()
  return (
      <div className={`h-screen w-full flex`}>
        <Sidebar/>
        <MainUI/>
      </div>
  );
}
