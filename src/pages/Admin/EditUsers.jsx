import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserById, updateUser } from "../../redux/adminSlice";
import {
  UserIcon,
  MailIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  SaveIcon,
} from "lucide-react";

const EditUser = () => {
  const { user_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => {
    return state.admin.users.find((u) => u.user_id === Number(user_id));
  });

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    roles: [],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch user data on page load
  useEffect(() => {
    if (!user) {
      dispatch(fetchUserById(Number(user_id)));
    } else {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        roles: user.roles || [],
      });
    }
  }, [dispatch, user_id, user]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    dispatch(updateUser({ userId: Number(user_id), userData: formData }))
      .then(() => {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/admin/users");
        }, 1500);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  // Role badge color mapping
  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-purple-100 text-purple-800",
      customer: "bg-blue-100 text-blue-800",
      seller: "bg-green-100 text-green-800",
      shipper: "bg-orange-100 text-orange-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  if (!user && !formData.email) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-300">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-300 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
        <UserIcon className="w-6 h-6 mr-2 text-blue-500" />
        Edit User Profile
      </h2>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg flex items-center text-green-700 animate-pulse">
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          User updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="group">
          <label className="block text-gray-700 font-medium mb-2 flex items-center">
            <UserIcon className="w-4 h-4 mr-2 text-blue-500" />
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 group-hover:border-blue-300"
            placeholder="Enter first name"
          />
        </div>

        <div className="group">
          <label className="block text-gray-700 font-medium mb-2 flex items-center">
            <UserIcon className="w-4 h-4 mr-2 text-blue-500" />
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 group-hover:border-blue-300"
            placeholder="Enter last name"
          />
        </div>

        <div className="group">
          <label className="block text-gray-700 font-medium mb-2 flex items-center">
            <MailIcon className="w-4 h-4 mr-2 text-blue-500" />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 group-hover:border-blue-300"
            placeholder="Enter email address"
          />
        </div>

        <div className="group">
          <label className="block text-gray-700 font-medium mb-2 flex items-center">
            <TagIcon className="w-4 h-4 mr-2 text-blue-500" />
            Role
          </label>
          <div className="relative">
            <select
              name="roles"
              value={formData.roles[0] || ""}
              onChange={(e) =>
                setFormData({ ...formData, roles: [e.target.value] })
              }
              className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 group-hover:border-blue-300"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
              <option value="shipper">Shipper</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>

          {formData.roles && formData.roles[0] && (
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                  formData.roles[0]
                )}`}
              >
                {formData.roles[0].charAt(0).toUpperCase() +
                  formData.roles[0].slice(1)}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8 pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-300 flex items-center shadow-sm border border-gray-300"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className={`px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 flex items-center shadow-md ${
              isSaving ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
