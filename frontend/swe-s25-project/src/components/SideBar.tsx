export default function Sidebar() {
  return (
    <nav className="h-screen flex flex-col bg-sidebar-primary border-r border-gray-300 shadow-sm ">
      <div className="p-4 pb-2 flex justify-between items-center">
        <h1>SWE S25 Project</h1>
      </div>
      <ul className="flex-1 px-3"></ul>
      <div className="border-t border-gray-300 flex p-3">
        <div className="w-10 h-10 rounded-md bg-gray-300"></div>
        <div className={`flex justify-between items center w-52 ml-3`}></div>
        <div className="leading-4">
            <h4 className="font-semibold">Enzo Panem</h4>
            <span className="text-xs text-gray-500">panemjf@gmail.com</span>
        </div>
      </div>
    </nav>
  );
}