import React from "react";
import { MdVerified } from "react-icons/md";

const VerifiedBadge = ({ size = "sm", className = "" }) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm", 
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  };

  return (
    <MdVerified 
      className={`text-blue-500 ${sizeClasses[size]} ${className}`}
      title="Verified"
    />
  );
};

export default VerifiedBadge;