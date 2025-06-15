import { LoaderCircle } from "lucide-react"
function Loader() {
  return (
    <div className="flex justify-center">
      <LoaderCircle className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );
}

export default Loader