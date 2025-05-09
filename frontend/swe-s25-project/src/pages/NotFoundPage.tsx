import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="h-screen w-full bg-primary flex justify-center items-center">
      <h1 className="text-[8rem]">Error 404: Not Found</h1>
      <Link to="/">Go Back</Link>
    </div>
  );
}
