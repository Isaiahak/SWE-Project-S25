import Sidebar from "./Sidebar";

export default function App() {
  return (
    <>
      <div className={`h-screen w-full flex items-center text-shadow-xs`}>
        <Sidebar />
        <div>
          <h1 className={`text-secondary text-xl font-bold`}>
            Game of Nodes
          </h1>
        </div>
      </div>
    </>
  );
}
