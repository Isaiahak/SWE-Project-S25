export default function MiniGame({ icon }) {
  return (
    <img
      src={icon}
      className="w-32 h-32 m-2 bg-white shadow-md shadow-tertiary rounded-2xl hover:cursor-pointer hover:shadow-lg hover:shadow-indigo-400 transition-transform delay-50 duration-200 ease-in-out hover:scale-110"
    ></img>
  );
}
