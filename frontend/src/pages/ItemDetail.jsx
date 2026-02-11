import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await API.get(`/items/${id}`);
        setItem(res.data.data);
      } catch (err) {
        setError("Item not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await API.delete(`/items/${id}`);
        navigate("/dashboard");
      } catch (err) {
        setError("Error deleting item.");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a]">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white/60 mb-2">{error || "Item not found"}</h2>
        <Link to="/" className="text-white/30 hover:text-white underline underline-offset-4 transition-colors">Go home</Link>
      </div>
    );
  }

  const isOwner = user && item.user && user._id === item.user._id;
  const isAdminUser = user && user.role === "admin";

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white/30 hover:text-white transition-colors mb-8 group animate-fade-in"
        >
          <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="glass-strong rounded-3xl overflow-hidden animate-fade-in-up">
          {/* Image */}
          {item.image ? (
            <div className="relative w-full h-64 md:h-[400px] bg-black/50">
              <img
                src={`http://localhost:5001/uploads/${item.image}`}
                alt={item.title}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          ) : (
            <div className="w-full h-48 bg-white/[0.02] flex items-center justify-center">
              <svg className="w-20 h-20 text-white/5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.type === "lost"
                      ? "bg-red-500/15 text-red-400 border border-red-500/20"
                      : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {item.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-medium tracking-wider ${
                    item.status === "active"
                      ? "bg-white/5 text-white/40 border border-white/10"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{item.title}</h1>
              </div>

              {(isOwner || isAdminUser) && (
                <button onClick={handleDelete} className="btn-danger text-sm">
                  Delete
                </button>
              )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-5">
                {[
                  { label: "Category", value: item.category },
                  {
                    label: "Location",
                    value: item.location,
                    icon: (
                      <svg className="w-4 h-4 mr-1.5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                  },
                  { label: "Date", value: formatDate(item.date) },
                ].map((field) => (
                  <div key={field.label}>
                    <h3 className="text-[10px] font-medium text-white/30 uppercase tracking-widest mb-1">{field.label}</h3>
                    <p className="text-white/70 flex items-center">{field.icon}{field.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="text-[10px] font-medium text-white/30 uppercase tracking-widest mb-1">Posted By</h3>
                  <p className="text-white/70">{item.user?.name || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-medium text-white/30 uppercase tracking-widest mb-1">Contact Email</h3>
                  <a href={`mailto:${item.contactEmail}`} className="text-white/70 hover:text-white underline underline-offset-4 transition-colors">
                    {item.contactEmail}
                  </a>
                </div>
                {item.contactPhone && (
                  <div>
                    <h3 className="text-[10px] font-medium text-white/30 uppercase tracking-widest mb-1">Phone</h3>
                    <a href={`tel:${item.contactPhone}`} className="text-white/70 hover:text-white underline underline-offset-4 transition-colors">
                      {item.contactPhone}
                    </a>
                  </div>
                )}
                <div>
                  <h3 className="text-[10px] font-medium text-white/30 uppercase tracking-widest mb-1">Posted On</h3>
                  <p className="text-white/70">{formatDate(item.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-[10px] font-medium text-white/30 uppercase tracking-widest mb-3">Description</h3>
              <p className="text-white/50 leading-relaxed whitespace-pre-wrap">{item.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;