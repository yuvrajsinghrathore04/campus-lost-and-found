import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative mt-auto border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">
                Lost<span className="text-white/50">&</span>Found
              </span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">
              Helping students and staff find their lost belongings on campus
              through a modern, easy-to-use platform.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/lost-items", label: "Lost Items" },
                { to: "/found-items", label: "Found Items" },
                { to: "/add-item", label: "Post Item" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/30 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-white/30">
              <li>lostandfound@campus.edu</li>
              <li>(555) 123-4567</li>
              <li>Student Center, Room 101</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 text-center">
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} Campus Lost & Found Portal. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;