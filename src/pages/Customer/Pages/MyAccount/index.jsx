import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AccountSidebar from "../../../../components/customer/Components/AccountSidebar";

const MyAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth.user
  );
  console.log(user);

  useEffect(() => {
    navigate(`my-account/profile/${user.user_id}`);
  }, [isAuthenticated, user, navigate]);

  if (isLoading) {
    return <div className="container py-10">Đang tải...</div>;
  }

  if (!isAuthenticated) {
    return null; // Sẽ chuyển hướng bởi useEffect
  }

  return (
    <div className="my-account py-6 sm:py-10 bg-gray-50">
      <div className="container px-4 sm:px-6">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/4 lg:w-1/5 pr-0 md:pr-4 lg:pr-6 mb-6 md:mb-0">
            <AccountSidebar />
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
