import React, { useState, useEffect } from "react";
import API from "../api/axios";
import ItemCard from "../components/ItemCard";

const LostItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    "Electronics", "Books", "Clothing", "Accessories", "Documents",
    "Keys", "Wallet", "Bag", "Sports", "Other",
  ];

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("type", "lost");
      params.append("page", currentPage);
      params.append("limit", "12");
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      const res = await API.get(`/items?${params.toString()}`);
      setItems(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching lost items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [currentPage, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-white/40 uppercase tracking-widest">
              Lost Items
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Lost Items</h1>
          <p className="text-white/30">
            Items reported as lost on campus
          </p>
        </div>

        {/* Search */}
        <div className="glass-strong rounded-2xl p-6 mb-10 animate-fade-in-up animate-stagger-1">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search items..."
                className="glass-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full md:w-52">
              <select
                className="glass-input"
                value={category}
                onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-white px-8">Search</button>
            <button
              type="button"
              onClick={() => { setSearch(""); setCategory(""); setCurrentPage(1); }}
              className="btn-glow px-6"
            >
              Clear
            </button>
          </form>
        </div>

        {/* Items */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, index) => (
                <ItemCard key={item._id} item={item} index={index} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn-glow px-4 py-2 text-sm disabled:opacity-30"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      currentPage === page
                        ? "bg-white text-black"
                        : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn-glow px-4 py-2 text-sm disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="glass rounded-2xl p-16 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white/60 mb-1">No items found</h3>
            <p className="text-white/30 text-sm">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LostItems;