import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const AddItem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "", description: "", category: "", type: "lost",
    location: "", date: "", contactEmail: user?.email || "",
    contactPhone: user?.phone || "", image: null,
  });

  const categories = [
    "Electronics", "Books", "Clothing", "Accessories", "Documents",
    "Keys", "Wallet", "Bag", "Sports", "Other",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { setError("Image must be < 5MB"); return; }
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] && key !== "image") data.append(key, formData[key]);
      });
      if (formData.image) data.append("image", formData.image);

      await API.post("/items", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Item posted successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error posting item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-white mb-2">Post an Item</h1>
          <p className="text-white/30">
            Report a lost or found item
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-strong rounded-2xl p-8 space-y-6 animate-fade-in-up animate-stagger-1"
        >
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
              {error}
            </div>
          )}
          {success && (
            <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm animate-fade-in">
              {success}
            </div>
          )}

          {/* Type Selection */}
          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-3">
              Item Type *
            </label>
            <div className="flex gap-4">
              {["lost", "found"].map((type) => (
                <label
                  key={type}
                  className={`flex-1 cursor-pointer rounded-xl p-5 text-center transition-all duration-300 ${
                    formData.type === type
                      ? type === "lost"
                        ? "bg-red-500/10 border border-red-500/30 text-red-400"
                        : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "bg-white/[0.02] border border-white/10 text-white/40 hover:bg-white/5"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <svg
                    className="w-8 h-8 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {type === "lost" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    )}
                  </svg>
                  <span className="font-semibold capitalize">I {type} Something</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Title *</label>
            <input name="title" type="text" required className="glass-input" placeholder="e.g., Black iPhone 14 Pro" value={formData.title} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Description *</label>
            <textarea name="description" required rows="4" className="glass-input" placeholder="Detailed description..." value={formData.description} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Category *</label>
            <select name="category" required className="glass-input" value={formData.category} onChange={handleChange}>
              <option value="">Select category</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Location *</label>
              <input name="location" type="text" required className="glass-input" placeholder="e.g., Library, 2nd Floor" value={formData.location} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Date *</label>
              <input name="date" type="date" required className="glass-input" value={formData.date} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Contact Email *</label>
              <input name="contactEmail" type="email" required className="glass-input" value={formData.contactEmail} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Phone (Optional)</label>
              <input name="contactPhone" type="tel" className="glass-input" value={formData.contactPhone} onChange={handleChange} />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Image (Optional)</label>
            <div className="border border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-colors cursor-pointer">
              {imagePreview ? (
                <div className="mb-4">
                  <img src={imagePreview} alt="Preview" className="mx-auto h-40 w-auto object-contain rounded-xl" />
                </div>
              ) : (
                <svg className="mx-auto h-12 w-12 text-white/10 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <label htmlFor="image-upload" className="cursor-pointer text-sm text-white/30 hover:text-white/50 transition-colors">
                <span className="text-white/60 underline underline-offset-4">{imagePreview ? "Change image" : "Upload an image"}</span>
                <span> — PNG, JPG up to 5MB</span>
                <input id="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-white py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                Posting...
              </span>
            ) : (
              "Post Item"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;