import requests

BASE_URL = "http://65.2.129.233:8000"


def create_game():
    response = requests.post(f"{BASE_URL}/create-game")
    response.raise_for_status()
    return response.json()


def make_move(game_id, player, row, col):
    payload = {
        "game_id": game_id,
        "player": player,
        "row": row,
        "col": col
    }
    response = requests.post(f"{BASE_URL}/make-move", json=payload)
    response.raise_for_status()
    return response.json()


def get_game(game_id):
    response = requests.get(f"{BASE_URL}/game/{game_id}")
    response.raise_for_status()
    return response.json()