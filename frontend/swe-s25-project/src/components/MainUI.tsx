import GameBar from "./GameBar";

export default function MainUI() {
  return (
    <div className="flex flex-col w-full items-center justify-between">
      <h1 className={`m-4 border-black text-secondary text-[6rem] font-[MuseoModerno] font-bold text-shadow-md`}>Game of Nodes</h1>
      <img className="h-120 w-[65vw] bg-secondary rounded-2xl p-4" src="globe.svg" alt="placeholder"/>
      <GameBar/>
    </div>
  );
}
