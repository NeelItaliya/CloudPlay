import React, { useEffect, useRef } from "react";

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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("games")}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:opacity-90 transition-all shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
            >
              Browse Games
            </button>
            <button
              onClick={() => navigate("about")}
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all"
            >
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: "99.9%", label: "Uptime" },
              { value: "Auto", label: "Scaling" },
              { value: "0ms", label: "Install time" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black text-white mb-1">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Built for the Cloud</h2>
            <p className="text-gray-400 text-lg">Enterprise-grade infrastructure for a seamless gaming experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "⚡",
                title: "Auto Scaling",
                desc: "AWS Auto Scaling Group spins up new instances automatically when traffic increases.",
                color: "from-yellow-500/20 to-orange-500/10",
                border: "border-yellow-500/20",
              },
              {
                icon: "⚖️",
                title: "Load Balancing",
                desc: "Application Load Balancer distributes traffic across multiple EC2 instances seamlessly.",
                color: "from-cyan-500/20 to-blue-500/10",
                border: "border-cyan-500/20",
              },
              {
                icon: "🔴",
                title: "Redis Sessions",
                desc: "Game sessions stored in Redis so any instance can serve any player at any time.",
                color: "from-red-500/20 to-pink-500/10",
                border: "border-red-500/20",
              },
            ].map(({ icon, title, desc, color, border }) => (
              <div
                key={title}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${color} border ${border} backdrop-blur-sm`}
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}