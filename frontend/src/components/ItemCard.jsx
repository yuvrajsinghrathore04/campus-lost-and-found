import React from "react";
import { Link } from "react-router-dom";

const ItemCard = ({ item, index = 0 }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div
      className="glass-card rounded-2xl overflow-hidden group animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "both" }}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        {item.image ? (
          <img
            src={`http://localhost:5001/uploads/${item.image}`}
            alt={item.title}
            className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
            <svg
              className="w-14 h-14 text-white/10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Type Badge */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
            item.type === "lost"
              ? "bg-red-500/20 text-red-300 border border-red-500/30"
              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
          }`}
        >
          {item.type}
        </span>

        {/* Category Badge */}
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-medium tracking-wider bg-white/10 text-white/70 border border-white/10 backdrop-blur-md">
          {item.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1 group-hover:text-white/90 transition-colors">
          {item.title}
        </h3>

        <p className="text-sm text-white/40 mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-xs text-white/30">
            <svg
              className="w-3.5 h-3.5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <span className="text-xs text-white/20">{formatDate(item.date)}</span>
        </div>

        <Link
          to={`/items/${item._id}`}
          className="block w-full text-center py-2.5 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;