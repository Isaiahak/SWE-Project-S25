import MiniGame from "./MiniGame";

export default function GameBar() {
    return (
        <div className="m-6 p-4 flex items-center rounded-2xl bg-light-blue-100 h-36 inset-shadow-sm">
            <MiniGame icon="startled.svg"/>
            <MiniGame icon="race.svg"/>
            <MiniGame icon="ufo.svg"/>
            <MiniGame icon="unicorn.svg"/>
            <MiniGame icon="thinking.svg"/>
        </div>
    );
}