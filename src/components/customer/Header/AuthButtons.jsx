import { Link } from "react-router-dom";
import { LogIn, UserPlus, User } from "lucide-react";

const AuthButtons = ({ isAuthenticated, user }) => {
  return (
    <div className="flex items-center">
      {isAuthenticated ? (
        <Link
          to="/profile"
          className="flex items-center gap-2 px-4 py-2 bg-white shadow-md rounded-full border border-gray-200 hover:shadow-lg transition duration-300"
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 border border-blue-200">
              <User size={20} className="text-blue-600" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-gray-800 font-medium">{user.name}</span>
            <span className="text-xs text-gray-500">View Profile</span>
          </div>
        </Link>
      ) : (
        <div className="flex items-center space-x-3">
          <Link
            to="/login"
            className="flex items-center gap-1 px-5 py-2 text-blue-600 border border-blue-600 rounded-full font-medium hover:bg-blue-50 focus:ring-2 focus:ring-blue-200 focus:outline-none transition duration-300"
          >
            <LogIn size={18} />
            <span>Login</span>
          </Link>
          
          <Link
            to="/register"
            className="flex items-center gap-1 px-5 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none transition duration-300 shadow-md"
          >
            <UserPlus size={18} />
            <span>Register</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;