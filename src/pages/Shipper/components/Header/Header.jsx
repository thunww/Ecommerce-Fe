import React from "react";
import Logo from "./logo";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

const Header = ({ isOnline, setIsOnline, notifications = [] }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-500 to-red-700 shadow-md text-white relative">
      <Logo />
      <h1 className="text-2xl font-bold tracking-wide">ShipPro</h1>
      <div className="flex items-center space-x-4">
        <NotificationBell notifications={notifications} />
        <UserMenu />
      </div>
    </div>
  );
};

export default Header;
