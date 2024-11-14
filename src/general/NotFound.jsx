import { RoutePaths } from './RoutePaths.jsx';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { BiErrorCircle } from 'react-icons/bi';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center px-6 py-8">
        <BiErrorCircle className="w-24 h-24 mx-auto text-red-500 mb-4" />
        <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="text-3xl font-semibold text-slate-800 mb-6">Page Not Found</h2>
        <p className="text-slate-600 mb-8 max-w-md">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <button
          onClick={() => navigate(RoutePaths.HOME)}
          className="inline-flex items-center px-6 py-3 rounded-lg bg-teal-800 text-white font-medium transition-colors hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FaHome className="w-5 h-5 mr-2 text-brand" />
          Return Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
