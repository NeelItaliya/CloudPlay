from pydantic import BaseModel
from typing import List, Optional


class StartSessionRequest(BaseModel):
    player_name: str


class MoveRequest(BaseModel):
    session_id: str
    position: int


class EndSessionRequest(BaseModel):
    session_id: str


class SessionState(BaseModel):
    session_id: str
    player_name: str
    board: List[str]
    current_turn: str
    status: str
    winner: Optional[str] = None