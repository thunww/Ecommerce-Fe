import React from 'react';

const ShipperLogo = ({ className = "" }) => {
  return (
    <img
      src="https://img.freepik.com/premium-vector/cute-courier-delivery-package-cartoon-vector_941466-7880.jpg"
      alt="ShipPro Logo"
      className={`${className} rounded-full object-cover`}
    />
  );
};

export default ShipperLogo; 