import React from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { useDisconnectedUser } from "./hooks/DisconnectedUser"
import HomePage from "./pages/HomePage"
import LobbyPage from "./pages/LobbyPage"
import NotFoundPage from "./pages/NotFoundPage"
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/lobby",
    element: <LobbyPage />,
  },
])

const App = () => {
  useDisconnectedUser()
  return(
    <RouterProvider  router={router} />
  ) 
}

export default App
