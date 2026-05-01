from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import boto3
import json
import os
import time
from botocore.exceptions import ClientError

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DynamoDB setup — uses IAM role on EC2, no credentials needed
AWS_REGION = os.getenv("AWS_REGION", "ap-south-1")
DYNAMODB_TABLE = os.getenv("DYNAMODB_TABLE", "cloudplay-sessions")
SESSION_TTL_SECONDS = 30 * 60  # 30 minutes

dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION)
table = dynamodb.Table(DYNAMODB_TABLE)


class StartSessionRequest(BaseModel):
    player_x: str
    player_o: str

class StartSessionResponse(BaseModel):
    session_id: str
    board: List[str]
    current_player: str
    winner: Optional[str]
    game_over: bool
    player_x: str
    player_o: str

class MoveRequest(BaseModel):
    session_id: str
    position: int

class EndSessionRequest(BaseModel):
    session_id: str


def get_session(session_id: str) -> dict:
    try:
        response = table.get_item(Key={"session_id": session_id})
        item = response.get("Item")
        if not item:
            return None
        if "board" in item:
            item["board"] = json.loads(item["board"])
        if "game_over" in item:
            item["game_over"] = bool(item["game_over"])
        if "winner" in item:
            item["winner"] = item.get("winner") or None
        return item
    except ClientError:
        return None

def save_session(session_id: str, session: dict):
    table.put_item(Item={
        "session_id": session_id,
        "board": json.dumps(session["board"]),
        "current_player": session["current_player"],
        "winner": session.get("winner") or "",
        "game_over": int(session["game_over"]),
        "player_x": session.get("player_x", "Player X"),
        "player_o": session.get("player_o", "Player O"),
        "ttl": int(time.time()) + SESSION_TTL_SECONDS
    })

def delete_session(session_id: str):
    table.delete_item(Key={"session_id": session_id})

def count_sessions() -> int:
    try:
        response = table.scan(Select="COUNT")
        return response.get("Count", 0)
    except ClientError:
        return 0


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
    return {"message": "CloudPlay backend is running"}

@app.get("/health")
def health():
    try:
        table.table_status
        db_status = "ok"
    except Exception:
        db_status = "unreachable"
    return {
        "status": "ok",
        "dynamodb": db_status,
        "active_sessions": count_sessions()
    }

@app.post("/session/start", response_model=StartSessionResponse)
def start_session(request: StartSessionRequest):
    session_id = str(uuid4())
    session = {
        "board": ["", "", "", "", "", "", "", "", ""],
        "current_player": "X",
        "winner": None,
        "game_over": False,
        "player_x": request.player_x,
        "player_o": request.player_o,
    }
    save_session(session_id, session)
    return {"session_id": session_id, **session}

@app.get("/session/{session_id}")
def get_session_state(session_id: str):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    save_session(session_id, session)
    return {
        "session_id": session_id,
        "board": session["board"],
        "current_player": session["current_player"],
        "winner": session["winner"],
        "game_over": session["game_over"],
        "player_x": session.get("player_x", "Player X"),
        "player_o": session.get("player_o", "Player O"),
    }

@app.post("/session/move")
def make_move(request: MoveRequest):
    session = get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if request.position < 0 or request.position > 8:
        raise HTTPException(status_code=400, detail="Invalid board position")

    if session["game_over"]:
        raise HTTPException(status_code=400, detail="Game is already over")

    if session["board"][request.position] != "":
        raise HTTPException(status_code=400, detail="Position already taken")

    session["board"][request.position] = session["current_player"]

    winner_mark = check_winner(session["board"])
    if winner_mark:
        # Store actual player name as winner
        winner_name = session["player_x"] if winner_mark == "X" else session["player_o"]
        session["winner"] = winner_name
        session["game_over"] = True
    elif "" not in session["board"]:
        session["winner"] = "Draw"
        session["game_over"] = True
    else:
        session["current_player"] = "O" if session["current_player"] == "X" else "X"

    save_session(request.session_id, session)

    return {
        "board": session["board"],
        "current_player": session["current_player"],
        "winner": session["winner"],
        "game_over": session["game_over"],
        "player_x": session.get("player_x", "Player X"),
        "player_o": session.get("player_o", "Player O"),
    }

@app.post("/session/end")
def end_session(request: EndSessionRequest):
    session = get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    delete_session(request.session_id)
    return {"message": "Session ended successfully"}

@app.get("/sessions")
def list_sessions():
    return {"active_sessions": count_sessions()}
