export default function Player({ isHost, isCurrentUser, avatar, nickname }) {
    const user = isHost  === true ? "(HOST)" : isCurrentUser === true ? "(YOU)" : ""
  
    return (
    <div>
      <img
        className="size-50 bg-secondary rounded-full ring-4 shadow-sm hover:cursor-pointer"
        src={avatar}
        alt="player-avatar"
      />
      <div className="flex justify-center bg-secondary rounded-lg text-black">{user}{nickname}</div>
    </div>
  );
}
