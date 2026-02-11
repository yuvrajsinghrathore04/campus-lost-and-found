import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/items/my-items");
        setItems(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = async (itemId) => {
    if (!window.confirm("Delete this item?")) return;
    setDeleteLoading(itemId);
    try {
      await API.delete(`/items/${itemId}`);
      setItems(items.filter((i) => i._id !== itemId));
      setMessage("Item deleted");
      setTimeout(() => setMessage(""), 3000);
    } catch (e) {
      setMessage("Error deleting");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const lostItems = items.filter((i) => i.type === "lost");
  const foundItems = items.filter((i) => i.type === "found");

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile */}
        <div className="glass-strong rounded-2xl p-8 mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center animate-glow">
                <span className="text-2xl font-bold text-white/60">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                <p className="text-white/30 text-sm">{user?.email}</p>
                {user?.role === "admin" && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-white/5 border border-white/10 text-white/40 text-[10px] font-medium rounded-full uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
            </div>
            <Link to="/add-item" className="btn-white text-sm">
              + Post New Item
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { value: items.length, label: "Total", color: "white" },
            { value: lostItems.length, label: "Lost", color: "red" },
            { value: foundItems.length, label: "Found", color: "emerald" },
          ].map((s, i) => (
            <div key={s.label} className="glass-card rounded-2xl p-6 text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}>
              <div className={`text-4xl font-black mb-1 ${s.color === "red" ? "text-red-400/80" : s.color === "emerald" ? "text-emerald-400/80" : "text-white/80"}`}>
                {s.value}
              </div>
              <div className="text-xs text-white/30 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm animate-fade-in ${message.includes("Error") ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"}`}>
            {message}
          </div>
        )}

        {/* Table */}
        <div className="glass-strong rounded-2xl overflow-hidden animate-fade-in-up animate-stagger-3">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xl font-bold text-white">My Items</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
            </div>
          ) : items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Item", "Type", "Category", "Location", "Date", "Actions"].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-[10px] font-medium text-white/30 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {item.image ? (
                            <img src={`http://localhost:5001/uploads/${item.image}`} alt="" className="w-10 h-10 rounded-xl object-cover mr-3 border border-white/10" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 mr-3 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <span className="text-sm font-medium text-white/70 max-w-[150px] truncate">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                          item.type === "lost" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}>{item.type}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/40">{item.category}</td>
                      <td className="px-6 py-4 text-sm text-white/40 max-w-[120px] truncate">{item.location}</td>
                      <td className="px-6 py-4 text-sm text-white/30">{formatDate(item.date)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link to={`/items/${item._id}`} className="text-xs text-white/40 hover:text-white transition-colors underline underline-offset-4">View</Link>
                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={deleteLoading === item._id}
                            className="text-xs text-red-400/60 hover:text-red-400 transition-colors underline underline-offset-4 disabled:opacity-30"
                          >
                            {deleteLoading === item._id ? "..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white/40 mb-2">No items yet</h3>
              <Link to="/add-item" className="btn-white text-sm inline-block mt-2">Post Your First Item</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;