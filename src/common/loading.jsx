import { FiSettings } from "react-icons/fi";
const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full animate-spin flex items-center justify-center">
          <FiSettings className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading ...</p>
      </div>
    </div>
  );
};
export default Loading;
