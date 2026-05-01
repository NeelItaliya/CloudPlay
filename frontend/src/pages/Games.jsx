import React from "react";

const games = [
  {
    id: "tictactoe",
    title: "Tic Tac Toe",
    description: "The classic 3×3 strategy game. Make your moves, outsmart your opponent, claim the board.",
    tag: "Classic",
    tagColor: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    players: "2 Players",
    status: "available",
    gradient: "from-cyan-500/20 to-blue-600/10",
    border: "border-cyan-500/20",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <line x1="16" y1="4" x2="16" y2="44" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="32" y1="4" x2="32" y2="44" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="4" y1="16" x2="44" y2="16" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="4" y1="32" x2="44" y2="32" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round"/>
        <text x="7" y="13" fontSize="9" fill="#67e8f9" fontWeight="bold">X</text>
        <text x="23" y="29" fontSize="9" fill="#e879f9" fontWeight="bold">O</text>
        <text x="35" y="13" fontSize="9" fill="#e879f9" fontWeight="bold">O</text>
      </svg>
    ),
  },
];

export default function Games({ navigate }) {
  return (
    <div className="relative min-h-screen pt-28 pb-20 px-6">
      {/* Background glow */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
            Game Library
          </div>
          <h1 className="text-5xl font-black text-white mb-3">Choose Your Game</h1>
          <p className="text-gray-400 text-lg">All games run in the cloud — no downloads, no installs.</p>
        </div>

        {/* Game grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className={`relative group rounded-2xl bg-gradient-to-br ${game.gradient} border ${game.border} p-6 transition-all duration-300 ${
                game.status === "available"
                  ? "hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
              }`}
              onClick={() => game.status === "available" && navigate("play", game.id)}
            >
              {/* Icon */}
              <div className="mb-5">{game.icon}</div>

              {/* Tag */}
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${game.tagColor} mb-3`}>
                {game.tag}
              </div>

              {/* Title & desc */}
              <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{game.description}</p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  {game.players}
                </span>
                {game.status === "available" ? (
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                    Play
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                ) : (
                  <span className="text-xs text-gray-600 font-medium">Coming soon</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
