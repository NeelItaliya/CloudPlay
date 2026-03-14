import React, { useMemo, useState } from "react";

const BASE_URL = "http://cloudplay-alb-1606782085.ap-south-1.elb.amazonaws.com";
const initialBoard = Array(9).fill("");

export default function TicTacToe({ navigate }) {
  const [sessionId, setSessionId] = useState(null);
  const [board, setBoard] = useState(initialBoard);
  const [status, setStatus] = useState("Press Start Game to begin");
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filledCount = useMemo(() => board.filter(Boolean).length, [board]);

  const startSession = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/session/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player_name: "Player1" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || "Unable to start session");
      setSessionId(data.session_id);
      setBoard(data.board || initialBoard);
      setWinner(null);
      setGameOver(false);
      setCurrentPlayer(data.current_player || "X");
      setStatus(`Session ready · ${data.session_id.slice(0, 8)}...`);
    } catch (e) {
      setError(`Could not connect to backend`);
      setStatus("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const makeMove = async (position) => {
    if (!sessionId || gameOver || board[position]) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/session/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, position }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || "Move failed");
      setBoard(data.board || initialBoard);
      setCurrentPlayer(data.current_player || "X");
      setWinner(data.winner || null);
      setGameOver(Boolean(data.game_over));
      if (data.game_over) {
        if (String(data.winner).toLowerCase() === "draw") setStatus("It's a draw!");
        else if (data.winner) setStatus(`${data.winner} wins! 🎉`);
        else setStatus("Game over");
      } else {
        setStatus(`Turn · ${data.current_player || "X"}`);
      }
    } catch (e) {
      setError(e.message || "Could not make move");
    } finally {
      setLoading(false);
    }
  };

  const resetLocal = () => {
    setSessionId(null);
    setBoard(initialBoard);
    setWinner(null);
    setGameOver(false);
    setCurrentPlayer("X");
    setError(null);
    setStatus("Press Start Game to begin");
  };

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-6">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Back button */}
        <button
          onClick={() => navigate("games")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          <span className="text-sm font-medium">Back to Games</span>
        </button>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left: board */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-3">
                Classic
              </div>
              <h1 className="text-4xl font-black text-white">Tic Tac Toe</h1>
            </div>

            {/* Board */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <div className="grid grid-cols-3 gap-3">
                {board.map((cell, index) => (
                  <button
                    key={index}
                    onClick={() => makeMove(index)}
                    disabled={loading || gameOver || !sessionId || !!cell}
                    className={`aspect-square rounded-xl text-4xl font-black transition-all duration-150 border ${
                      cell === "X"
                        ? "text-cyan-400 border-cyan-500/30 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                        : cell === "O"
                        ? "text-pink-400 border-pink-500/30 bg-pink-500/10 shadow-lg shadow-pink-500/10"
                        : sessionId && !gameOver
                        ? "border-white/8 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 cursor-pointer"
                        : "border-white/5 bg-white/[0.01] cursor-not-allowed"
                    }`}
                  >
                    {cell}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={startSession}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-cyan-500/20"
              >
                {loading ? "Starting..." : sessionId ? "New Game" : "Start Game"}
              </button>
              <button
                onClick={resetLocal}
                className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right: info */}
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Match Status</div>
              <div className={`text-lg font-bold ${gameOver ? "text-yellow-400" : "text-white"}`}>
                {status}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Session", value: sessionId ? `${sessionId.slice(0, 6)}...` : "—" },
                { label: "Turn", value: gameOver ? "Done" : currentPlayer },
                { label: "Moves", value: `${filledCount}/9` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">{label}</div>
                  <div className="text-sm font-bold text-white truncate">{value}</div>
                </div>
              ))}
            </div>

            {/* Winner */}
            {winner && gameOver && String(winner).toLowerCase() !== "draw" && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <div className="text-yellow-400 font-bold text-lg">🏆 {winner} Wins!</div>
                <div className="text-gray-400 text-sm mt-1">Congratulations to the winner!</div>
              </div>
            )}

            {/* Draw */}
            {gameOver && String(winner).toLowerCase() === "draw" && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
                <div className="text-blue-400 font-bold text-lg">🤝 It's a Draw!</div>
                <div className="text-gray-400 text-sm mt-1">Nobody backed down!</div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                <div className="text-red-400 text-sm">{error}</div>
              </div>
            )}

            {/* Cloud info */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">Cloud Infrastructure</div>
              <div className="space-y-2">
                {[
                  { label: "Backend", value: "FastAPI on EC2" },
                  { label: "Sessions", value: "Redis" },
                  { label: "Scaling", value: "AWS ASG + ALB" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-gray-300 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
