import SidebarButton from "./SidebarButton";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav className="h-screen w-60 flex flex-col justify-between bg-sidebar-primary shadow-lg">
      <div className="flex flex-col">
        <h1 className="text-center font-[Bebas Neue] font-bold text-[1.75rem]">
          Aken Studios
        </h1>
        <SidebarButton label="PLAY" />
        <Link to="/lobby">
          <SidebarButton label="CREATE" />
        </Link>
        <SidebarButton label="JOIN" />
        <SidebarButton label="FRIENDS" />
      </div>
    </nav>
  );
}
