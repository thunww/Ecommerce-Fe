import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AccountSidebar from "../../../../components/customer/Components/AccountSidebar";
import { fetchUserById } from "../../../../redux/adminSlice";
const MyAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.admin.selectedUser);
  const userId = useSelector((state) => state.auth.user?.user_id); // Get user_id from auth state
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user?.user_id && location.pathname === "/my-account") {
      navigate(`/my-account/profile/${user.user_id}`);
    }
  }, [user, navigate, location]);

  if (!user) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="my-account py-6 sm:py-10 bg-gray-50">
      <div className="container px-4 sm:px-6">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/4 lg:w-1/5 pr-0 md:pr-4 lg:pr-6 mb-6 md:mb-0">
            <AccountSidebar user={user} />
          </div>
          <div className="w-full md:w-3/4 lg:w-4/5">
            <div className="bg-white shadow-md rounded-md p-4 sm:p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
