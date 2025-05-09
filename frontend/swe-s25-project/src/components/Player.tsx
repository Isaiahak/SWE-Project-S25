export default function Player({ isHost, avatar, nickname }) {
    const host = isHost ? "HOST: " : "";
  
    return (
    <div>
      <img
        className="size-50 bg-secondary rounded-full ring-4 shadow-sm hover:cursor-pointer"
        src={avatar}
        alt="player-avatar"
      />
      <div className="flex justify-center bg-secondary rounded-lg text-black">{host}{nickname}</div>
    </div>
  );
}
