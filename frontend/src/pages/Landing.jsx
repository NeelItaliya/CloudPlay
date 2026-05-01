import React from "react";

export default function Landing({ navigate }) {
  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-purple-600/8 rounded-full blur-[80px]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px"
        }} />
      </div>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Cloud-Powered Gaming Platform
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-6">
            <span className="text-white">Play Games</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              In The Cloud
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            CloudPlay runs entirely in your browser, powered by a scalable cloud backend with auto-scaling and load balancing.
          </p>

          {/* CTAs */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate("games")}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:opacity-90 transition-all shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
            >
              Browse Games
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
