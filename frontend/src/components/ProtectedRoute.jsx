import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white/50 animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-white/20 animate-spin-slow"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;