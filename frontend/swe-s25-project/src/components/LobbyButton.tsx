export default function LobbyButton({
  label,
  height = "h-20",
  width = "w-80",
  fontSize = "text-[2rem]",
  onClick
}) {
  return (
    <button 
      onClick={onClick}
      className={`p-4 ${height} ${width} ${fontSize} text-black bg-secondary rounded-2xl font-bold shadow-md hover:cursor-pointer hover:shadow-lg hover:shadow-indigo-400 transition-transform delay-50 duration-200 ease-in-out hover:scale-105`}
    >
      {label}
    </button>
  );
}
