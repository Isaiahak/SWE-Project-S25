
// import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Sidebar from './components/SideBar';
import MainUI from './components/MainUI';

export default function App() {
  return (
      <div className={`h-screen w-full flex`}>
        <Sidebar/>
        <MainUI/>
      </div>
  );
}
