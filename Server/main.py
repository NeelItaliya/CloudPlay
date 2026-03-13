from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

SESSION_TIMEOUT_MINUTES = 30

class StartSessionResponse(BaseModel):
    session_id: str
    board: List[str]
    current_player: str
    winner: Optional[str]
    game_over: bool

class MoveRequest(BaseModel):
    session_id: str
    position: int

class EndSessionRequest(BaseModel):
    session_id: str

sessions: Dict[str, dict] = {}

def cleanup_sessions():
    expired = []
    now = datetime.utcnow()
    for session_id, data in sessions.items():
        last_activity = data["last_activity"]
        if now - last_activity > timedelta(minutes=SESSION_TIMEOUT_MINUTES):
            expired.append(session_id)

    for session_id in expired:
        del sessions[session_id]

def check_winner(board):
    winning_combinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    for combo in winning_combinations:
        a, b, c = combo
        if board[a] != "" and board[a] == board[b] == board[c]:
            return board[a]

    return None

@app.get("/")
def root():
    return {"message": "Cloud Tic-Tac-Toe backend is running"}

@app.get("/health")
def health():
    cleanup_sessions()
    return {
        "status": "ok",
        "active_sessions": len(sessions)
    }

@app.post("/session/start", response_model=StartSessionResponse)
def start_session():
    cleanup_sessions()

    session_id = str(uuid4())
    now = datetime.utcnow()

    sessions[session_id] = {
        "board": ["", "", "", "", "", "", "", "", ""],
        "current_player": "X",
        "winner": None,
        "game_over": False,
        "created_at": now,
        "last_activity": now
    }

    return {
        "session_id": session_id,
        "board": sessions[session_id]["board"],
        "current_player": sessions[session_id]["current_player"],
        "winner": sessions[session_id]["winner"],
        "game_over": sessions[session_id]["game_over"]
    }

@app.get("/session/{session_id}")
def get_session_state(session_id: str):
    cleanup_sessions()

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    sessions[session_id]["last_activity"] = datetime.utcnow()

    session = sessions[session_id]
    return {
        "session_id": session_id,
        "board": session["board"],
        "current_player": session["current_player"],
        "winner": session["winner"],
        "game_over": session["game_over"]
    }

@app.post("/session/move")
def make_move(request: MoveRequest):
    cleanup_sessions()

    if request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    if request.position < 0 or request.position > 8:
        raise HTTPException(status_code=400, detail="Invalid board position")

    session = sessions[request.session_id]

    if session["game_over"]:
        raise HTTPException(status_code=400, detail="Game is already over")

    if session["board"][request.position] != "":
        raise HTTPException(status_code=400, detail="Position already taken")

    session["board"][request.position] = session["current_player"]

    winner = check_winner(session["board"])
    if winner:
        session["winner"] = winner
        session["game_over"] = True
    elif "" not in session["board"]:
        session["winner"] = "Draw"
        session["game_over"] = True
    else:
        session["current_player"] = "O" if session["current_player"] == "X" else "X"

    session["last_activity"] = datetime.utcnow()

    return {
        "board": session["board"],
        "current_player": session["current_player"],
        "winner": session["winner"],
        "game_over": session["game_over"]
    }

@app.post("/session/end")
def end_session(request: EndSessionRequest):
    cleanup_sessions()

    if request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    del sessions[request.session_id]

    return {
        "message": "Session ended successfully"
    }

@app.get("/sessions")
def list_sessions():
    cleanup_sessions()
    return {
        "active_sessions": len(sessions),
        "session_ids": list(sessions.keys())
    }