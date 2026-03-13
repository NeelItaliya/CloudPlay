import tkinter as tk
from tkinter import messagebox
import requests

BASE_URL = "http://65.2.129.233:8000"

session_id = None
current_board = ["", "", "", "", "", "", "", "", ""]


def start_session():
    global session_id, current_board
    try:
        response = requests.post(
            f"{BASE_URL}/session/start",
            json={"player_name": "Player1"},
            timeout=5
        )

        print("START STATUS:", response.status_code)
        print("START TEXT:", response.text)

        if response.status_code != 200:
            messagebox.showerror(
                "Error",
                f"Start session failed\n\nStatus: {response.status_code}\nResponse: {response.text}"
            )
            return

        data = response.json()

        session_id = data["session_id"]
        current_board = data["board"]

        for button in buttons:
            button.config(state="normal")

        update_board()
        status_label.config(text=f"Session started: {session_id[:8]}...")

    except requests.exceptions.ConnectionError:
        messagebox.showerror("Error", f"Cannot connect to backend at {BASE_URL}")
    except requests.exceptions.Timeout:
        messagebox.showerror("Error", "Backend request timed out")
    except Exception as e:
        messagebox.showerror("Error", f"Could not start session:\n{str(e)}")


def make_move(position):
    global current_board, session_id

    if session_id is None:
        messagebox.showwarning("Warning", "Start a session first")
        return

    if current_board[position] != "":
        return

    try:
        payload = {
            "session_id": session_id,
            "position": position
        }

        response = requests.post(
            f"{BASE_URL}/session/move",
            json=payload,
            timeout=5
        )

        print("MOVE STATUS:", response.status_code)
        print("MOVE TEXT:", response.text)

        data = response.json()

        if response.status_code != 200:
            messagebox.showerror("Error", data.get("detail", "Move failed"))
            return

        current_board = data.get("board", ["", "", "", "", "", "", "", "", ""])
        update_board()

        winner = data.get("winner")
        game_over = data.get("game_over", False)
        current_player = data.get("current_player", "X")

        if game_over:
            if winner and str(winner).lower() == "draw":
                status_label.config(text="Draw")
                messagebox.showinfo("Game Over", "It's a draw")
                disable_buttons()
            elif winner:
                status_label.config(text=f"Winner: {winner}")
                messagebox.showinfo("Game Over", f"Winner: {winner}")
                disable_buttons()
            else:
                status_label.config(text="Game Over")
                disable_buttons()
        else:
            status_label.config(text=f"Next turn: {current_player}")

    except requests.exceptions.ConnectionError:
        messagebox.showerror("Error", f"Cannot connect to backend at {BASE_URL}")
    except requests.exceptions.Timeout:
        messagebox.showerror("Error", "Backend request timed out")
    except Exception as e:
        messagebox.showerror("Error", f"Could not make move:\n{e}")


def update_board():
    for i in range(9):
        buttons[i].config(text=current_board[i] if current_board[i] else " ")


def disable_buttons():
    for button in buttons:
        button.config(state="disabled")


def reset_game():
    global session_id, current_board
    session_id = None
    current_board = ["", "", "", "", "", "", "", "", ""]
    for button in buttons:
        button.config(text=" ", state="normal")
    status_label.config(text="Click Start Game")


root = tk.Tk()
root.title("Cloud Tic-Tac-Toe")
root.geometry("420x520")
root.minsize(420, 520)

title_label = tk.Label(root, text="Cloud Tic-Tac-Toe", font=("Arial", 18, "bold"))
title_label.pack(pady=10)

status_label = tk.Label(root, text="Click Start Game", font=("Arial", 12))
status_label.pack(pady=5)

board_frame = tk.Frame(root)
board_frame.pack(pady=20)

buttons = []
for i in range(9):
    button = tk.Button(
        board_frame,
        text=" ",
        font=("Arial", 24, "bold"),
        width=5,
        height=2,
        command=lambda i=i: make_move(i)
    )
    button.grid(row=i // 3, column=i % 3, padx=5, pady=5)
    buttons.append(button)

control_frame = tk.Frame(root)
control_frame.pack(pady=20)

start_button = tk.Button(
    control_frame,
    text="Start Game",
    font=("Arial", 12),
    width=12,
    height=2,
    command=start_session
)
start_button.grid(row=0, column=0, padx=10, pady=10)

reset_button = tk.Button(
    control_frame,
    text="Reset",
    font=("Arial", 12),
    width=12,
    height=2,
    command=reset_game
)
reset_button.grid(row=0, column=1, padx=10, pady=10)

root.update_idletasks()
screen_width = root.winfo_screenwidth()
screen_height = root.winfo_screenheight()
window_width = 420
window_height = 520
x = (screen_width // 2) - (window_width // 2)
y = (screen_height // 2) - (window_height // 2)
root.geometry(f"{window_width}x{window_height}+{x}+{y}")

root.mainloop()