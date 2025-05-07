"use client";

import React from "react";

interface TransitionLogoProps {
  isActive: boolean;
}

const TransitionLogo: React.FC<TransitionLogoProps> = ({ isActive }) => {
  return (
    <div className={`transition-logo ${isActive ? "active" : ""}`}>
      <div className="logo-container">
        <div className="logo-text">AP</div>
        <svg className="logo-circle" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" />
        </svg>
      </div>
    </div>
  );
};

export default TransitionLogo;
