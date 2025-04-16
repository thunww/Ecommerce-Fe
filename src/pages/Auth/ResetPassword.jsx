import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get("token");
    if (urlToken) {
      console.log("Token retrieved from URL:", urlToken);
      setToken(urlToken);
    } else {
      navigate("/error-page");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-right" });
      return;
    }

    if (!token) {
      toast.error("Invalid or missing token!", { position: "top-right" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/reset-password",
        {
          token,
          newPassword,
        }
      );

      toast.success(response.data.message || "Password reset successfully!", {
        position: "top-right",
      });
      setLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error(err.response?.data?.message || "An error occurred!", {
        position: "top-right",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full p-8 bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Main container */}
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl shadow-lg border border-gray-100 bg-white bg-opacity-90 backdrop-blur-md">
        <div className="flex flex-wrap">
          {/* Left side - Image */}
          <div className="hidden md:block w-1/2 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="./login.png"
                alt="Reset password visual"
                className="h-full w-full object-contain hover:scale-102 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Right side - Reset Password Form */}
          <div className="w-full md:w-1/2 bg-white p-8 bg-gradient-to-br from-white to-blue-50">
            <div className="max-w-md mx-auto">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full shadow-md">
                  <Lock className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 ml-3">
                  Reset Password
                </h2>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-indigo-400" />
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition duration-150 bg-white shadow-sm"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-indigo-400" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition duration-150 bg-white shadow-sm"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 shadow-md disabled:opacity-50"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
