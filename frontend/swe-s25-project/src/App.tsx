function App() {
  
  const color = {
    primary: "#C5BAFF",
    secondary: "#FBFBFB",
    tertiary: "#C4D9FF"
  };
  
  return (
    <>
      <div className={`bg-[${color.primary}] h-screen w-full flex flex-col items-center`}>
        <h1 className={`text-[${color.secondary}] text-xl`}>SWE S25 Project</h1>
      </div>
    </>
  );
}

export default App;