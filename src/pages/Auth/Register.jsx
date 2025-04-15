import { Link } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../redux/authSlice";
import AddressSelector from "../../components/AddressSelector";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState({
    province: '',
    district: '',
    ward: '',
    street: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !address.province ||
      !address.district ||
      !address.ward ||
      !address.street
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin!", { position: "top-right" });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!", { position: "top-right" });
      return;
    }

    try {
      const result = await dispatch(
        register({ 
          username, 
          email, 
          password,
          address: `${address.street}, ${address.ward}, ${address.district}, ${address.province}`
        })
      ).unwrap();

      toast.success(result.message || "Đăng ký thành công!", {
        position: "top-right",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Đăng ký thất bại!", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-full p-8 bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl shadow-lg border border-gray-100 bg-white bg-opacity-90 backdrop-blur-md">
        <div className="flex flex-wrap">
          {/* Image section */}
          <div className="hidden md:block w-1/2 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="https://ad2cart.com/wp-content/uploads/2021/02/ecommerce-website-banners.jpg"
                alt="Register visual"
                className="h-full w-full object-contain hover:scale-102 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Form section */}
          <div className="w-full md:w-1/2 bg-white p-8 bg-gradient-to-br from-white to-blue-50">
            <div className="max-w-md mx-auto">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full shadow-md">
                  <User className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 ml-3">
                  Register
                </h2>
              </div>

              <form className="space-y-3" onSubmit={handleSubmit}>
                {/* Username */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    User Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-indigo-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition duration-150 bg-white shadow-sm"
                      placeholder="Enter your full name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-indigo-400" />
                    </div>
                    <input
                      type="email"
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition duration-150 bg-white shadow-sm"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-indigo-400" />
                    </div>
                    <input
                      type="password"
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition duration-150 bg-white shadow-sm"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
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
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none transition duration-150 bg-white shadow-sm"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Địa chỉ
                  </label>
                  <AddressSelector onAddressChange={setAddress} />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 shadow-md"
                >
                  Register
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </form>

              {/* Social login buttons */}
              <div className="relative my-6 ">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-r from-white to-blue-50 text-gray-500">
                    Or sign up with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <button className="flex items-center justify-center py-2 px-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition duration-150">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </button>
                <button className="flex items-center justify-center py-2 px-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition duration-150">
                  <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>

              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition duration-150"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
