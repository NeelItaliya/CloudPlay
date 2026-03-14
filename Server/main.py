from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from fastapi.middleware.cors import CORSMiddleware
import redis
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

SESSION_TIMEOUT_MINUTES = 30
SESSION_TTL_SECONDS = SESSION_TIMEOUT_MINUTES * 60

# Redis connection — reads REDIS_URL from environment, falls back to localhost
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
r = redis.from_url(REDIS_URL, decode_responses=True)


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


def get_session_from_redis(session_id: str) -> dict:
    data = r.get(f"session:{session_id}")
    if not data:
        return None
    return json.loads(data)

def save_session_to_redis(session_id: str, session: dict):
    r.setex(
        f"session:{session_id}",
        SESSION_TTL_SECONDS,
        json.dumps(session)
    )

def delete_session_from_redis(session_id: str):
    r.delete(f"session:{session_id}")

def count_active_sessions() -> int:
    return len(r.keys("session:*"))


def check_winner(board):
    winning_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
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
    try:
        r.ping()
        redis_status = "ok"
    except Exception:
        redis_status = "unreachable"
    return {
        "status": "ok",
        "redis": redis_status,
        "active_sessions": count_active_sessions()
    }

@app.post("/session/start", response_model=StartSessionResponse)
def start_session():
    session_id = str(uuid4())

    session = {
        "board": ["", "", "", "", "", "", "", "", ""],
        "current_player": "X",
        "winner": None,
        "game_over": False,
    }

    save_session_to_redis(session_id, session)

    return {
        "session_id": session_id,
        **session
    }

@app.get("/session/{session_id}")
def get_session_state(session_id: str):
    session = get_session_from_redis(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Refresh TTL on access
    save_session_to_redis(session_id, session)

    return {
        "session_id": session_id,
        **session
    }

@app.post("/session/move")
def make_move(request: MoveRequest):
    session = get_session_from_redis(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if request.position < 0 or request.position > 8:
        raise HTTPException(status_code=400, detail="Invalid board position")

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

    save_session_to_redis(request.session_id, session)

    return {
        "board": session["board"],
        "current_player": session["current_player"],
        "winner": session["winner"],
        "game_over": session["game_over"]
    }

@app.post("/session/end")
def end_session(request: EndSessionRequest):
    session = get_session_from_redis(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    delete_session_from_redis(request.session_id)

    return {"message": "Session ended successfully"}

@app.get("/sessions")
def list_sessions():
    return {
        "active_sessions": count_active_sessions()
    }