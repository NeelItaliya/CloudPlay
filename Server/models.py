from pydantic import BaseModel
from typing import List, Optional


class CreateGameResponse(BaseModel):
    game_id: str
    board: List[List[str]]
    current_turn: str
    status: str
    winner: Optional[str] = None


class MoveRequest(BaseModel):
    game_id: str
    player: str
    row: int
    col: int


class GameStateResponse(BaseModel):
    game_id: str
    board: List[List[str]]
    current_turn: str
    status: str
    winner: Optional[str] = None
    message: str