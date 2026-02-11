import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/[0.01] rounded-full blur-3xl" />

      <div className="relative text-center animate-fade-in-up">
        <h1 className="text-[150px] md:text-[200px] font-black text-white/[0.03] leading-none select-none">
          404
        </h1>
        <div className="-mt-20 md:-mt-24">
          <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
          <p className="text-white/30 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn-white inline-block">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;