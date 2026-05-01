import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Games from "./pages/Games";
import TicTacToe from "./pages/TicTacToe";
import Snake from "./pages/Snake";

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedGame, setSelectedGame] = useState(null);

  const navigate = (p, game = null) => {
    setSelectedGame(game);
    setPage(p);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#080b14] text-white font-sans">
      <Navbar navigate={navigate} currentPage={page} />
      {page === "home" && <Landing navigate={navigate} />}
      {page === "games" && <Games navigate={navigate} />}
      {page === "play" && selectedGame === "tictactoe" && <TicTacToe navigate={navigate} />}
      {page === "play" && selectedGame === "snake" && <Snake navigate={navigate} />}
    </div>
  );
}
