import ActionButton from "./ActionButton";

export default function Sidebar() {
  return (
    <nav className="h-screen w-80 flex flex-col justify-between bg-sidebar-primary shadow-lg">
      <div className="flex flex-col">
        <h1 className="text-center font-[Bebas Neue] font-bold text-[2rem]">
          Aken Studios
        </h1>
        <ActionButton label="PLAY"/>
        <ActionButton label="CREATE" />
        <ActionButton label="JOIN" />
        <ActionButton label="FRIENDS" />
      </div>
    </nav>
  );
}
