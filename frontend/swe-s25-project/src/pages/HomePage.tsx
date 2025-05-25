import Sidebar from '../components/SideBar';
import MainUI from '../components/MainUI';
import GameProvider from '../hooks/GameProvider.tsx'
export default function HomePage() {
  return (
      <div className={`h-screen w-full flex`}>
        <GameProvider>
          <Sidebar/>
          <MainUI/>
        </GameProvider>
      </div>
  );
}
