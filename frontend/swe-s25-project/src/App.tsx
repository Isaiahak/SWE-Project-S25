import React from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { useDisconnectedUser } from "./hooks/DisconnectedUser"
import HomePage from "./pages/HomePage"
import LobbyPage from "./pages/LobbyPage"
import NotFoundPage from "./pages/NotFoundPage"
import GamePage from "./pages/GamePage"
import URLJoin from './components/URLJoin'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <GamePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/lobby",
    element: <LobbyPage />,
  },
  {
    path:"/join/:code",
    element: <URLJoin />,
  },
])

const App = () => {
  useDisconnectedUser()
  return(
    <RouterProvider  router={router} />
  ) 
}

export default App
