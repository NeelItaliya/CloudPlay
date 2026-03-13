from fastapi import APIRouter, HTTPException
from models.session_models import StartSessionRequest, MoveRequest, EndSessionRequest
from services.game_service import create_session, make_move, get_session, end_session


router = APIRouter()


@router.post("/session/start")
def start_session(request: StartSessionRequest):
    try:
        session = create_session(request.player_name)
        return session
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/session/move")
def move(request: MoveRequest):
    try:
        session = make_move(request.session_id, request.position)
        return session
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/session/{session_id}")
def fetch_session(session_id: str):
    try:
        session = get_session(session_id)
        return session
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/session/end")
def close_session(request: EndSessionRequest):
    try:
        return end_session(request.session_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))