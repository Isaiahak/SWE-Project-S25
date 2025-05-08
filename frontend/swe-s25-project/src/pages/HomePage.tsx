
import Sidebar from '../components/SideBar';
import MainUI from '../components/MainUI';

export default function HomePage() {
  return (
      <div className={`h-screen w-full flex`}>
        <Sidebar/>
        <MainUI/>
      </div>
  );
}
