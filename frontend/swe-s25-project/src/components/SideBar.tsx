import ActionButton from "./ActionButton";

import { Goal, GoalIcon } from "lucide-react";

export default function Sidebar() {
  return (
    <nav className="h-screen w-80 flex flex-col justify-between bg-sidebar-primary shadow-md">
      <h1 className="text-center font-[Bebas Neue] font-bold">
        Aken Studios
      </h1>
      <div className="flex flex-col">
        <ActionButton label="PLAY" />
        <ActionButton label="CREATE" />
        <ActionButton label="JOIN" />
        <ActionButton label="FRIENDS" />
      </div>
      <div></div>
    </nav>
  );
}
