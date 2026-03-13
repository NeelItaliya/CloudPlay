import uuid
from models.session_models import SessionState
from store.memory_store import sessions


WIN_PATTERNS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]


def create_session(player_name: str) -> SessionState:
    session_id = str(uuid.uuid4())
    session = SessionState(
        session_id=session_id,
        player_name=player_name,
        board=["", "", "", "", "", "", "", "", ""],
        current_turn="X",
        status="running",
        winner=None
    )
    sessions[session_id] = session
    return session


def get_session(session_id: str) -> SessionState:
    if session_id not in sessions:
        raise ValueError("Session not found")
    return sessions[session_id]


def check_winner(board):
    for pattern in WIN_PATTERNS:
        a, b, c = pattern
        if board[a] and board[a] == board[b] == board[c]:
            return board[a]
    return None


def check_draw(board):
    return all(cell != "" for cell in board)


def make_move(session_id: str, position: int) -> SessionState:
    if session_id not in sessions:
        raise ValueError("Session not found")

    session = sessions[session_id]

    if session.status != "running":
        raise ValueError("Game already finished")

    if position < 0 or position > 8:
        raise ValueError("Invalid board position")

    if session.board[position] != "":
        raise ValueError("Position already occupied")

    session.board[position] = session.current_turn

    winner = check_winner(session.board)
    if winner:
        session.status = "finished"
        session.winner = winner
        return session

    if check_draw(session.board):
        session.status = "draw"
        return session

    session.current_turn = "O" if session.current_turn == "X" else "X"
    return session


def end_session(session_id: str):
    if session_id not in sessions:
        raise ValueError("Session not found")
    del sessions[session_id]
    return {"message": "Session ended successfully"}