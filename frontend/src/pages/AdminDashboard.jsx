import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("items");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, usersRes] = await Promise.all([
          API.get("/items/admin/all"),
          API.get("/auth/users"),
        ]);
        setItems(itemsRes.data.data);
        setUsers(usersRes.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteItem = async (itemId) => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse-slow" />
            <span className="text-xs font-medium text-white/40 uppercase tracking-widest">Admin Panel</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/30">Manage all items and users</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { value: items.length, label: "Items", color: "white" },
            { value: items.filter((i) => i.type === "lost").length, label: "Lost", color: "red" },
            { value: items.filter((i) => i.type === "found").length, label: "Found", color: "emerald" },
            { value: users.length, label: "Users", color: "white" },
          ].map((s, i) => (
            <div key={s.label} className="glass-card rounded-2xl p-5 text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}>
              <div className={`text-3xl font-black mb-1 ${s.color === "red" ? "text-red-400/80" : s.color === "emerald" ? "text-emerald-400/80" : "text-white/80"}`}>{s.value}</div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm animate-fade-in ${message.includes("Error") ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"}`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="glass-strong rounded-2xl overflow-hidden animate-fade-in-up animate-stagger-3">
          <div className="flex border-b border-white/5">
            {["items", "users"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium transition-all duration-300 capitalize ${
                  activeTab === tab
                    ? "text-white border-b-2 border-white"
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                {tab} ({tab === "items" ? items.length : users.length})
              </button>
            ))}
          </div>

          {activeTab === "items" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Item", "Type", "Category", "Posted By", "Date", "Actions"].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-[10px] font-medium text-white/30 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white/70 max-w-[200px] truncate">{item.title}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                          item.type === "lost" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}>{item.type}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/40">{item.category}</td>
                      <td className="px-6 py-4 text-sm text-white/40">{item.user?.name || "Unknown"}</td>
                      <td className="px-6 py-4 text-sm text-white/30">{formatDate(item.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link to={`/items/${item._id}`} className="text-xs text-white/40 hover:text-white transition-colors underline underline-offset-4">View</Link>
                          <button
                            onClick={() => handleDeleteItem(item._id)}
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["User", "Email", "Role", "Joined"].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-[10px] font-medium text-white/30 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mr-3">
                            <span className="text-xs font-bold text-white/40">{u.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="text-sm font-medium text-white/70">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/40">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-medium rounded-full uppercase tracking-wider ${
                          u.role === "admin" ? "bg-white/10 text-white/60 border border-white/20" : "bg-white/5 text-white/30 border border-white/10"
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/30">{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;