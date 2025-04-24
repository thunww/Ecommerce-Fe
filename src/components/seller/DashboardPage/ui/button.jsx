import React from "react";

const Button = ({ children, className, ...props }) => {
  return (
    <button className={`px-4 py-2 bg-red-500 text-white rounded ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
