export default function SidebarButton({ label }) {
  return (
    <button className="p-4 w-full font-bold text-secondary/80 text-shadow-xs hover:bg-hover hover:text-secondary hover:cursor-pointer hover:text-shadow-md">
      {label}
    </button>
  );
}
