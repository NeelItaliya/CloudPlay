import React from "react";

export default function About() {
  const stack = [
    { category: "Frontend", items: ["React", "Tailwind CSS", "Vite"] },
    { category: "Backend", items: ["Python", "FastAPI", "Uvicorn"] },
    { category: "Cloud", items: ["AWS EC2", "ALB", "Auto Scaling Group"] },
    { category: "Infrastructure", items: ["Redis", "GitHub Actions", "Terraform"] },
  ];

  const timeline = [
    { step: "01", title: "User opens game", desc: "Browser loads React frontend from Vercel or EC2" },
    { step: "02", title: "Request hits ALB", desc: "Application Load Balancer receives HTTP request on port 80" },
    { step: "03", title: "Routes to EC2", desc: "ALB forwards to a healthy EC2 instance on port 8000" },
    { step: "04", title: "FastAPI processes", desc: "Python backend handles game logic and session management" },
    { step: "05", title: "Redis stores state", desc: "Session data saved to Redis — accessible by all instances" },
    { step: "06", title: "ASG scales", desc: "Auto Scaling Group adds instances when traffic increases" },
  ];

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-6">
      <div className="absolute top-32 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-4">
            About CloudPlay
          </div>
          <h1 className="text-5xl font-black text-white mb-4">Cloud Architecture</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            CloudPlay is a college project demonstrating real-world cloud infrastructure with auto-scaling, load balancing, and Redis session management.
          </p>
        </div>

        {/* Tech stack */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stack.map(({ category, items }) => (
              <div key={category} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">{category}</div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Request flow */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">How a Request Flows</h2>
          <div className="space-y-3">
            {timeline.map(({ step, title, desc }, i) => (
              <div key={step} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-cyan-400">{step}</span>
                </div>
                <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl p-4">
                  <div className="text-sm font-bold text-white mb-0.5">{title}</div>
                  <div className="text-sm text-gray-400">{desc}</div>
                </div>
                {i < timeline.length - 1 && (
                  <div className="absolute ml-5 mt-10 w-px h-3 bg-white/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
