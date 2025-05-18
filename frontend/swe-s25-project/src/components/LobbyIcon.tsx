export default function LobbyIcon({ hostName, gameType, currentPlayers,onClick }) {
  return (
     <div 
    className="w-full md:w-[40%] p-4 bg-sidebar-primary rounded-xl shadow-md hover:shadow-xl hover:bg-sidebar-primary/90 hover:-translate-y-1 transition-all duration-200 flex flex-col gap-2 mb-4 cursor-pointer"
    onClick={onClick}
  >
    <div className="bg-secondary/20 p-2 rounded-lg">
      <h2 className="text-white font-semibold text-lg truncate">{gameType}</h2>
    </div>
    <div className="flex justify-between items-center text-white text-sm">
      <div className="flex items-center gap-1 overflow-hidden">
        <span className="font-medium flex-shrink-0">Host:</span>
        <span className="truncate">{hostName}</span>
      </div>
      <div className="bg-secondary/30 px-3 py-1 rounded-full flex-shrink-0">
        <span>{currentPlayers}/8</span>
      </div>
    </div>
    </div>
  )
}