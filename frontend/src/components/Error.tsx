import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

function Error() {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
        <h1 className="text-6xl font-bold text-blue-600">Error</h1>
        <p className="mt-2 text-gray-600">
          Something went wrong. Please try again later.
        </p>
        <Button
          className="mt-4 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </div>
    </>
  );
}

export default Error;
