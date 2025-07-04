import { Link } from "react-router-dom";
import type { Task } from "../types/taskTypes";

function SearchResult({
  results,
  setResults,
}: {
  results: Task[];
  setResults: (results: Task[]) => void;
}) {
  return (
    <ul className="absolute mt-1 left-0 right-0 bg-white text-black rounded shadow-lg z-50">
      {results.map(task => (
        <li
          key={task.id}
          className="px-4 py-2 cursor-pointer text-sm"
        >
          <div className="flex items-center space-x-2">
            <Link
              to={`/task/${task.id}`}
              className="block"
              onClick={() => {
                setResults([]);
              }}
            >
              {task.title}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default SearchResult;
