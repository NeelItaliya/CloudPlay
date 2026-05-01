import React, { useEffect, useMemo, useRef, useState } from "react";

const BASE_URL = "http://cloudplay-alb-39971291.ap-south-1.elb.amazonaws.com";
const GRID_SIZE = 15;
const START_SNAKE = [
  { x: 7, y: 7 },
  { x: 6, y: 7 },
  { x: 5, y: 7 },
];
const START_FOOD = { x: 11, y: 7 };
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1, name: "up" },
  ArrowDown: { x: 0, y: 1, name: "down" },
  ArrowLeft: { x: -1, y: 0, name: "left" },
  ArrowRight: { x: 1, y: 0, name: "right" },
};

function PlayerModal({ onStart, onClose, loading }) {
  const [playerName, setPlayerName] = useState("");

  const handleStart = () => {
    if (!playerName.trim()) return;
    onStart(playerName.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-[#0d1117] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
            New Snake Run
          </div>
          <h2 className="text-2xl font-black text-white">Enter Player Name</h2>
          <p className="text-gray-400 text-sm mt-1">Your session start and end data will be stored</p>
        </div>

        <div className="mb-8">
          <label className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2 block">
            Player
          </label>
          <input
            autoFocus
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            placeholder="Enter name..."
            maxLength={20}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition-all"
          />
        </div>

        <button
          onClick={handleStart}
          disabled={!playerName.trim() || loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
        >
          {loading ? "Starting..." : "Start Game"}
        </button>
      </div>
    </div>
  );
}

function getRandomFood(snake) {
  const occupied = new Set(snake.map((part) => `${part.x},${part.y}`));
  const emptyCells = [];

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      if (!occupied.has(`${x},${y}`)) emptyCells.push({ x, y });
    }
  }

  return emptyCells[Math.floor(Math.random() * emptyCells.length)] || START_FOOD;
}

function isOpposite(next, current) {
  return next.x + current.x === 0 && next.y + current.y === 0;
}

export default function Snake({ navigate }) {
  const [sessionId, setSessionId] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [snake, setSnake] = useState(START_SNAKE);
  const [food, setFood] = useState(START_FOOD);
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight);
  const [nextDirection, setNextDirection] = useState(DIRECTIONS.ArrowRight);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const endedRef = useRef(false);

  const cells = useMemo(() => {
    const snakeMap = new Map(snake.map((part, index) => [`${part.x},${part.y}`, index]));
    return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
      const x = index % GRID_SIZE;
      const y = Math.floor(index / GRID_SIZE);
      const snakeIndex = snakeMap.get(`${x},${y}`);
      return { x, y, snakeIndex, isFood: food.x === x && food.y === y };
    });
  }, [snake, food]);

  const resetBoard = () => {
    setSnake(START_SNAKE);
    setFood(START_FOOD);
    setDirection(DIRECTIONS.ArrowRight);
    setNextDirection(DIRECTIONS.ArrowRight);
    setScore(0);
    setGameOver(false);
    endedRef.current = false;
  };

  const resetLocalBoard = () => {
    setSnake(START_SNAKE);
    setFood(START_FOOD);
    setDirection(DIRECTIONS.ArrowRight);
    setNextDirection(DIRECTIONS.ArrowRight);
    setScore(0);
    setError(null);
    setGameOver(false);
    setRunning(Boolean(sessionId && !endedRef.current));
  };

  const startSession = async (name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/snake/session/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player_name: name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || "Unable to start Snake session");

      resetBoard();
      setSessionId(data.session_id);
      setPlayerName(data.player_name);
      setHighScore(data.high_score || 0);
      setRunning(true);
      setShowModal(false);
    } catch (e) {
      setError("Could not connect to backend");
    } finally {
      setLoading(false);
    }
  };

  const endSession = async (finalScore = score) => {
    if (!sessionId || endedRef.current) return;
    endedRef.current = true;
    setRunning(false);
    setGameOver(true);
    try {
      const response = await fetch(`${BASE_URL}/snake/session/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, score: finalScore }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || "Unable to end Snake session");
      setHighScore(data.high_score || finalScore);
    } catch {
      setError("Game ended locally, but the ending record could not be saved");
    }
  };

  const handleDirection = (next) => {
    if (!running || gameOver) return;
    setNextDirection((currentNext) => (isOpposite(next, direction) ? currentNext : next));
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      const next = DIRECTIONS[event.key];
      if (!next) return;
      event.preventDefault();
      handleDirection(next);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [direction, running, gameOver]);

  useEffect(() => {
    if (!running || gameOver) return undefined;

    const timer = window.setTimeout(() => {
      setSnake((currentSnake) => {
        const activeDirection = isOpposite(nextDirection, direction) ? direction : nextDirection;
        setDirection(activeDirection);

        const head = currentSnake[0];
        const nextHead = { x: head.x + activeDirection.x, y: head.y + activeDirection.y };
        const hitWall = nextHead.x < 0 || nextHead.x >= GRID_SIZE || nextHead.y < 0 || nextHead.y >= GRID_SIZE;
        const ateFood = nextHead.x === food.x && nextHead.y === food.y;
        const bodyToCheck = ateFood ? currentSnake : currentSnake.slice(0, -1);
        const hitSelf = bodyToCheck.some((part) => part.x === nextHead.x && part.y === nextHead.y);

        if (hitWall || hitSelf) {
          endSession(score);
          return currentSnake;
        }

        const nextSnake = [nextHead, ...currentSnake];
        if (ateFood) {
          const nextScore = score + 10;
          setScore(nextScore);
          setHighScore((currentHigh) => Math.max(currentHigh, nextScore));
          setFood(getRandomFood(nextSnake));
          return nextSnake;
        }

        nextSnake.pop();
        return nextSnake;
      });
    }, Math.max(80, 170 - score * 2));

    return () => window.clearTimeout(timer);
  }, [direction, food, gameOver, nextDirection, running, score]);

  const startNewGame = () => setShowModal(true);

  const returnToGames = async () => {
    if (sessionId && !gameOver) {
      await endSession(score);
    }
    navigate("games");
  };

  return (
    <div className="relative min-h-screen pt-20 pb-6 px-6 overflow-hidden">
      {showModal && (
        <PlayerModal onStart={startSession} onClose={() => setShowModal(false)} loading={loading} />
      )}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[620px] h-[380px] bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <button
          onClick={returnToGames}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className="text-sm font-medium">Back to Games</span>
        </button>

        <div className="mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-2">
            Arcade
          </div>
          <h1 className="text-3xl font-black text-white">Snake</h1>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-3 sm:p-4">
            <div
              className="grid gap-1 w-full max-w-[min(540px,calc(100vh-250px))] mx-auto aspect-square"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
            >
              {cells.map((cell) => (
                <div
                  key={`${cell.x}-${cell.y}`}
                  className={`rounded-[4px] border ${
                    cell.snakeIndex === 0
                      ? "bg-emerald-300 border-emerald-200 shadow-sm shadow-emerald-300/30"
                      : cell.snakeIndex > 0
                      ? "bg-emerald-500 border-emerald-400/50"
                      : cell.isFood
                      ? "bg-rose-400 border-rose-300 shadow-sm shadow-rose-400/30"
                      : "bg-white/[0.025] border-white/[0.04]"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Run Status</div>
              <div className={`text-lg font-bold ${gameOver ? "text-yellow-400" : running ? "text-white" : "text-gray-400"}`}>
                {gameOver ? "Game over" : running ? `${playerName}'s run` : "Press Start Game to begin"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Score", value: score },
                { label: "Best", value: highScore },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/[0.03] border border-white/8 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">{label}</div>
                  <div className="text-sm font-bold text-white truncate">{value}</div>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                <div className="text-red-400 text-sm">{error}</div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={startNewGame}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-emerald-500/20"
              >
                {sessionId ? "New Game" : "Start Game"}
              </button>
              <button
                onClick={resetLocalBoard}
                disabled={!sessionId}
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
