export default function Player({ isHost, isCurrentUser, avatar, nickname }) {
    const user = isHost  === true ? "(HOST)" : isCurrentUser === true ? "(YOU)" : ""
  
    return (
    <div className="w-[25%] flex flex-col  justify-center items-center gap-y-2">
      <img
        className="size-50 bg-secondary rounded-full ring-4 shadow-sm hover:cursor-pointer"
        src={avatar}
        alt="player-avatar"
      />
      <div className="w-50 h-7 flex justify-center bg-secondary rounded-lg text-black">{user}{nickname}</div>
    </div>
  );
}
