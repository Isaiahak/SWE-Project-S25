import { ChangeIcon } from '../services/LobbyServices'
import { useState } from 'react'
export default function ChangeIconModal({ isOpen, onClose }){
  const avatars = [
    '/public/icons/anaconda.png',
    '/public/icons/bear.png',
    '/public/icons/blackbird.png',
    '/public/icons/cow.png',
    '/public/icons/ganesha.png',
    '/public/icons/jaguar.png',
    '/public/icons/panda-bear.png',
    '/public/icons/turtle.png'
  ]
  const [currentIcon, setCurrentIcon] = useState(0)
  const handleChangeIcon = (currentIcon) =>{
    ChangeIcon(currentIcon)
    onClose()
  }

  if (!isOpen) return null
	return(
  <>
    <div className="fixed inset-0 w-[100vw] h-[100vh] bg-black opacity-70 z-20"></div>
    	<div className="absolute inset-0 z-30 flex items-center justify-center">
        <div className="relative w-[90%] max-w-2xl p-6 bg-secondary text-secondary rounded-2xl opacity-100 shadow-xl flex flex-col  items-center justify-center gap-6 font-display">
          <button
            className="self-end text-3xl text-black hover:text-hover hover:cursor-pointer transition-transform duration-150 hover:scale-110"
            onClick={onClose}
          >
          ×
          </button>
          <div className="relative w-[100%] flex flex-row flex-wrap gap-6 items-center justify-center">
            {avatars.map((avatar,index)=>(
            <img
              key={index}
              className="size-30 bg-secondary rounded-full ring-4 shadow-sm hover:cursor-pointer hover:scale-110 ease-in-out duration-325"
              src={avatar}
              alt="player-avatar"
              onClick={() => setCurrentIcon(index)}
            />
            ))}
          </div>
          
          <button
            className="py-3 px-5 bg-sidebar-primary text-white rounded-xl font-semibold shadow-md hover:bg-hover hover:cursor-pointer transition duration-200"
            onClick={() => handleChangeIcon(currentIcon)}
          >
            Select Icon!
          </button>
    	</div>
    </div>
  </>
	)
}