import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, RotateCcw, Play, Cloud, Wifi, Sparkles } from "lucide-react";

const BASE_URL = "http://cloudplay-alb-1194727634.ap-south-1.elb.amazonaws.com";
const initialBoard = Array(9).fill("");

export default function App() {
  const [sessionId, setSessionId] = useState(null);
  const [board, setBoard] = useState(initialBoard);
  const [status, setStatus] = useState("Press Start Game to begin your cloud match");
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

      if (!response.ok) {
        throw new Error(data?.detail || "Unable to start session");
      }

      setSessionId(data.session_id);
      setBoard(data.board || initialBoard);
      setWinner(null);
      setGameOver(false);
      setCurrentPlayer(data.current_player || "X");
      setStatus(`Cloud session ready • ${data.session_id.slice(0, 8)}...`);
    } catch (e) {
      console.error(e);
      setError(`Could not connect to backend at ${BASE_URL}`);
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

      if (!response.ok) {
        throw new Error(data?.detail || "Move failed");
      }

      setBoard(data.board || initialBoard);
      setCurrentPlayer(data.current_player || "X");
      setWinner(data.winner || null);
      setGameOver(Boolean(data.game_over));

      if (data.game_over) {
        if (String(data.winner).toLowerCase() === "draw") {
          setStatus("Draw game • nobody backed down");
        } else if (data.winner) {
          setStatus(`${data.winner} wins the cloud battle`);
        } else {
          setStatus("Game over");
        }
      } else {
        setStatus(`Next turn • ${data.current_player || "X"}`);
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
    setStatus("Press Start Game to begin your cloud match");
  };

  return (
    <div className="page">
      <div className="container">
        <div className="hero-grid">
          <div className="card hero-card">
            <div className="title-row">
              <div className="icon-box">
                <Cloud size={28} />
              </div>
              <div>
                <h1>Cloud Tic-Tac-Toe</h1>
                <p>A browser game powered by your cloud backend.</p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-label"><Wifi size={14} /> Session</div>
                <div className="stat-value">{sessionId ? `${sessionId.slice(0, 8)}...` : "Not started"}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Current turn</div>
                <div className="stat-value">{gameOver ? "Finished" : currentPlayer}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Moves played</div>
                <div className="stat-value">{filledCount}/9</div>
              </div>
            </div>

            <div className="button-row">
              <button className="primary-btn" onClick={startSession} disabled={loading}>
                <Play size={18} /> {sessionId ? "Start New Cloud Session" : "Start Game"}
              </button>
              <button className="secondary-btn" onClick={resetLocal}>
                <RotateCcw size={18} /> Reset Board
              </button>
            </div>

            <div className="badge-row">
              <span className="badge green">Live API connected</span>
              <span className="badge cyan">Browser ready</span>
              <span className="badge pink">No desktop install needed</span>
            </div>
          </div>

          <div className="card side-card">
            <h2><Sparkles size={18} /> Match Feed</h2>
            <div className="status-box">{status}</div>

            {winner && gameOver && String(winner).toLowerCase() !== "draw" && (
              <div className="winner-box">
                <div className="winner-title"><Trophy size={18} /> Winner announced</div>
                <p>{winner} has taken the board.</p>
              </div>
            )}

            {error && <div className="error-box">{error}</div>}

            <div className="info-box">
              Start a session, click any tile, and every move is sent to your cloud backend.
            </div>
          </div>
        </div>

        <div className="main-grid">
          <div className="card">
            <h2>Arena Board</h2>
            <div className="board">
              {board.map((cell, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: gameOver || !!cell || !sessionId ? 1 : 1.03 }}
                  className={`cell ${cell === "X" ? "x" : ""} ${cell === "O" ? "o" : ""}`}
                  onClick={() => makeMove(index)}
                  disabled={loading || gameOver || !sessionId || !!cell}
                >
                  {cell}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="right-column">
            <div className="card">
              <h2>Why this works better</h2>
              <div className="feature-grid">
                <div className="feature-box">
                  <h3>Cross-platform</h3>
                  <p>Runs in browser on Windows, Mac, or mobile without packaging headaches.</p>
                </div>
                <div className="feature-box">
                  <h3>Cloud-first</h3>
                  <p>Moves are processed by your backend, which keeps the cloud project angle strong.</p>
                </div>
                <div className="feature-box">
                  <h3>Easy to demo</h3>
                  <p>Share one link with your faculty or friends and let them play instantly.</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Deployment note</h2>
              <p className="deploy-note">
                If your backend blocks browser requests, enable CORS on the FastAPI server for the domain where you host this frontend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}