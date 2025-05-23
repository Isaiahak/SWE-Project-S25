export default function NoLobbyModal({ isOpen, onClose }){

	if (!isOpen) return null
	return(
	<>
		<div className="fixed inset-0 w-[100vw] h-[100vh] bg-black opacity-70 z-20"></div>
			<div className="absolute inset-0 z-30 flex items-center justify-center">
				<div className="relative w-[90%] max-w-2xl p-6 bg-secondary text-secondary rounded-2xl opacity-100 shadow-xl flex flex-col gap-6 font-display">
				<button
				className="self-end text-3xl text-black hover:text-hover hover:cursor-pointer transition-transform duration-150 hover:scale-110"
				onClick={onClose}
				>
				×
				</button>
				<h1
				className="w-full p-3 text-black rounded-lg outline-none border border-primary placeholder-gray-600 focus:ring-2 focus:ring-hover"
				>Sorry there are no lobbies currently!</h1>
			</div>
		</div>
	</>
	)
}