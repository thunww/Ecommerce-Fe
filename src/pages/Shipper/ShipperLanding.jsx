import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShipperLogo from '../../components/shipper/ShipperLogo';

const ShipperLanding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/shipper/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F84C4C] flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="animate-fade-in-up mb-4">
          <ShipperLogo className="w-24 h-24 mx-auto" />
        </div>
        <h1 className="text-4xl font-bold text-white animate-fade-in-up animation-delay-200">
          ShipPro
        </h1>
        <p className="text-white mt-2 animate-fade-in-up animation-delay-400">
          Hệ thống quản lý vận chuyển thông minh
        </p>
      </div>
    </div>
  );
};

export default ShipperLanding; 