import tkinter as tk
from tkinter import messagebox

from api import create_game, make_move


class TicTacToeApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Cloud Tic-Tac-Toe")
        self.root.geometry("350x450")

        self.game_id = None
        self.current_turn = None
        self.buttons = []

        self.title_label = tk.Label(root, text="Cloud Tic-Tac-Toe", font=("Arial", 18, "bold"))
        self.title_label.pack(pady=10)

        self.status_label = tk.Label(root, text="Click New Game", font=("Arial", 12))
        self.status_label.pack(pady=10)

        self.board_frame = tk.Frame(root)
        self.board_frame.pack()

        for i in range(3):
            row_buttons = []
            for j in range(3):
                btn = tk.Button(
                    self.board_frame,
                    text="",
                    font=("Arial", 24),
                    width=5,
                    height=2,
                    command=lambda r=i, c=j: self.handle_click(r, c)
                )
                btn.grid(row=i, column=j, padx=5, pady=5)
                row_buttons.append(btn)
            self.buttons.append(row_buttons)

        self.new_game_button = tk.Button(root, text="New Game", font=("Arial", 12), command=self.start_new_game)
        self.new_game_button.pack(pady=20)

    def start_new_game(self):
        try:
            data = create_game()
            self.game_id = data["game_id"]
            self.current_turn = data["current_turn"]
            self.update_board(data["board"])
            self.status_label.config(text=f"Game started | Turn: {self.current_turn}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to create game:\n{e}")

    def handle_click(self, row, col):
        if not self.game_id:
            messagebox.showwarning("Warning", "Start a new game first")
            return

        try:
            data = make_move(self.game_id, self.current_turn, row, col)
            self.update_board(data["board"])

            status = data["status"]
            winner = data["winner"]
            message = data["message"]
            self.current_turn = data["current_turn"]

            if status == "finished":
                self.status_label.config(text=f"{message}")
                messagebox.showinfo("Game Over", message)
            elif status == "draw":
                self.status_label.config(text="Game is a draw")
                messagebox.showinfo("Game Over", "Game is a draw")
            else:
                self.status_label.config(text=f"{message} | Turn: {self.current_turn}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to make move:\n{e}")

    def update_board(self, board):
        for i in range(3):
            for j in range(3):
                self.buttons[i][j].config(text=board[i][j])


if __name__ == "__main__":
    root = tk.Tk()
    app = TicTacToeApp(root)
    root.mainloop()