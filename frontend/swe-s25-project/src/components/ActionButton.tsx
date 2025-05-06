export default function ActionButton({label}) {
    return (
        <button className="p-4 font-bold text-gray-200 text-shadow-xs hover:bg-sidebar-hover hover:text-secondary hover:cursor-pointer hover:text-shadow-md">
            {label}
        </button>
    );
}