import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex items-center border-b-2 border-gray-300 py-2">
              <FaUser className="text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full focus:outline-none text-gray-700"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center border-b-2 border-gray-300 py-2">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full focus:outline-none text-gray-700"
                required
              />
            </div>
          </div>
          <button className="w-full py-3 bg-indigo-500 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all">
            Login
          </button>
        </form>
        <p className="mt-4 text-gray-600 text-sm">
          Don't have an account? <a href="#" className="text-indigo-500">Sign up</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
