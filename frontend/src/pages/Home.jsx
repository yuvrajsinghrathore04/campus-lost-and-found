import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import ItemCard from "../components/ItemCard";

const Home = () => {
  const [recentLost, setRecentLost] = useState([]);
  const [recentFound, setRecentFound] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ lost: 0, found: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lostRes, foundRes] = await Promise.all([
          API.get("/items?type=lost&limit=4"),
          API.get("/items?type=found&limit=4"),
        ]);
        setRecentLost(lostRes.data.data);
        setRecentFound(foundRes.data.data);
        setStats({
          lost: lostRes.data.total,
          found: foundRes.data.total,
        });
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/[0.03] to-transparent rounded-full" />

        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-2 h-2 bg-white/20 rounded-full animate-pulse-slow" />
        <div className="absolute top-40 left-32 w-1 h-1 bg-white/30 rounded-full animate-pulse-slow animate-stagger-2" />
        <div className="absolute bottom-32 right-40 w-1.5 h-1.5 bg-white/15 rounded-full animate-pulse-slow animate-stagger-3" />
        <div className="absolute bottom-48 left-20 w-1 h-1 bg-white/25 rounded-full animate-pulse-slow animate-stagger-4" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full glass mb-8 text-xs font-medium text-white/50 tracking-wider uppercase">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 animate-pulse" />
              Campus Lost & Found System
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 animate-fade-in-up animate-stagger-1 tracking-tighter">
            <span className="text-gradient">Find What</span>
            <br />
            <span className="text-white/20">You've Lost</span>
          </h1>

          <p className="text-lg md:text-xl text-white/30 mb-12 max-w-2xl mx-auto animate-fade-in-up animate-stagger-2 font-light leading-relaxed">
            A minimal, modern platform to report and discover lost & found items
            across campus. Simple. Fast. Effective.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animate-stagger-3">
            <Link
              to="/add-item"
              className="btn-white text-base px-8 py-4"
            >
              Report an Item
            </Link>
            <Link
              to="/lost-items"
              className="btn-glow text-base px-8 py-4"
            >
              Browse Items
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: stats.lost, label: "Lost Items", color: "red" },
              { value: stats.found, label: "Found Items", color: "emerald" },
              { value: stats.lost + stats.found, label: "Total Items", color: "white" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="glass-card rounded-2xl p-8 text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 0.15}s`, animationFillMode: "both" }}
              >
                <div
                  className={`text-5xl font-black mb-2 ${
                    stat.color === "red"
                      ? "text-red-400/80"
                      : stat.color === "emerald"
                      ? "text-emerald-400/80"
                      : "text-white/80"
                  }`}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-white/30 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              How It Works
            </h2>
            <p className="text-white/30 max-w-lg mx-auto">
              Three simple steps to report or find lost items on campus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                ),
                title: "Post",
                desc: "Create a detailed listing with photo, location, and description of the lost or found item.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                ),
                title: "Search",
                desc: "Browse through listings, filter by category, and search for specific items.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                ),
                title: "Connect",
                desc: "Reach out to the poster via the provided contact info and reclaim your item.",
              },
            ].map((step, i) => (
              <div
                key={step.title}
                className="glass-card rounded-2xl p-8 text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 0.15}s`, animationFillMode: "both" }}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                  <svg
                    className="w-7 h-7 text-white/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {step.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-white/30 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Lost Items */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Recently Lost
              </h2>
              <p className="text-white/30 text-sm">Items reported as lost on campus</p>
            </div>
            <Link
              to="/lost-items"
              className="text-sm text-white/40 hover:text-white transition-colors duration-300 flex items-center gap-1"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
            </div>
          ) : recentLost.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentLost.map((item, index) => (
                <ItemCard key={item._id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl p-12 text-center">
              <p className="text-white/30">No lost items posted yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Found Items */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Recently Found
              </h2>
              <p className="text-white/30 text-sm">Items found and waiting for their owners</p>
            </div>
            <Link
              to="/found-items"
              className="text-sm text-white/40 hover:text-white transition-colors duration-300 flex items-center gap-1"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
            </div>
          ) : recentFound.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentFound.map((item, index) => (
                <ItemCard key={item._id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl p-12 text-center">
              <p className="text-white/30">No found items posted yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Lost Something?
              </h2>
              <p className="text-white/30 mb-8 max-w-md mx-auto">
                Post it now and let the campus community help you find it.
              </p>
              <Link to="/add-item" className="btn-white text-base px-8 py-4 inline-block">
                Report Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;