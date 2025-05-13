import MiniGame from "./MiniGame";

export default function GameBar() {
    return (
        <div className="m-6 p-4 flex items-center rounded-2xl bg-light-blue-100 h-36 inset-shadow-sm">
            <MiniGame icon="startled.svg" game={1}/>
            <MiniGame icon="race.svg" game={2}/>
            <MiniGame icon="ufo.svg" game={3}/>
            <MiniGame icon="unicorn.svg" game={4}/>
            <MiniGame icon="thinking.svg" game={5}/>
        </div>
    );
}