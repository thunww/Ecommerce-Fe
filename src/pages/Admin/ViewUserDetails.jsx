import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserById } from "../../redux/adminSlice";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  ArrowLeftIcon,
  BadgeCheckIcon,
  MapPinIcon,
  BriefcaseIcon,
} from "lucide-react";

const ViewUserDetails = () => {
  const { user_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.admin.selectedUser);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!user || user.user_id !== Number(user_id)) {
      dispatch(fetchUserById(Number(user_id)));
    } else {
      setUserData(user);
    }
  }, [dispatch, user_id, user]);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-center">
          <UserIcon className="w-12 h-12 mx-auto text-blue-300" />
          <p className="mt-4 text-gray-500">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <UserIcon className="w-8 h-8 mr-3 text-blue-500" /> User Profile Details
      </h2>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Left column - Profile picture */}
        <div className="md:w-1/4 flex flex-col items-center">
          <div className="mb-8 relative">
            <img
              src={
                userData.profile_picture ||
                "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
              }
              alt="Profile"
              className="w-48 h-48 rounded-full border-4 border-blue-500 shadow-lg object-cover"
            />
            <div className="absolute bottom-3 right-3 bg-green-500 p-2 rounded-full">
              <BadgeCheckIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {userData.first_name} {userData.last_name}
          </h3>
          <p className="text-blue-500 text-lg font-medium">
            @{userData.username}
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="mt-10 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg flex items-center hover:bg-gray-200 transition shadow-sm"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" /> Back to Users List
          </button>
        </div>

        {/* Right column - User details */}
        <div className="md:w-3/4 space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <DetailItem
              icon={<UserIcon className="w-6 h-6 text-blue-500" />}
              label="First Name"
              value={userData.first_name}
            />
            <DetailItem
              icon={<UserIcon className="w-6 h-6 text-blue-500" />}
              label="Last Name"
              value={userData.last_name}
            />
          </div>

          <DetailItem
            icon={<BadgeCheckIcon className="w-6 h-6 text-green-500" />}
            label="Username"
            value={userData.username}
          />

          <DetailItem
            icon={<MailIcon className="w-6 h-6 text-red-500" />}
            label="Email Address"
            value={userData.email}
          />

          <DetailItem
            icon={<PhoneIcon className="w-6 h-6 text-yellow-500" />}
            label="Phone Number"
            value={userData.phone}
          />

          <DetailItem
            icon={<CalendarIcon className="w-6 h-6 text-purple-500" />}
            label="Date of Birth"
            value={new Date(userData.date_of_birth).toLocaleDateString()}
          />

          {/* Additional fields - these would display if available in your data */}
          {userData.address && (
            <DetailItem
              icon={<MapPinIcon className="w-6 h-6 text-orange-500" />}
              label="Address"
              value={userData.address}
            />
          )}

          {userData.job_title && (
            <DetailItem
              icon={<BriefcaseIcon className="w-6 h-6 text-indigo-500" />}
              label="Job Title"
              value={userData.job_title}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center p-5 border border-gray-300 rounded-lg bg-gray-50 shadow-sm hover:bg-gray-100 transition">
    <div className="p-3 bg-white rounded-full shadow-sm">{icon}</div>
    <div className="ml-5">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-xl font-semibold text-gray-900">{value || "—"}</p>
    </div>
  </div>
);

export default ViewUserDetails;
