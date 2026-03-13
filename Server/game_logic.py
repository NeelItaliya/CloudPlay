def create_empty_board():
    return [["" for _ in range(3)] for _ in range(3)]


def check_winner(board):
    for i in range(3):
        if board[i][0] != "" and board[i][0] == board[i][1] == board[i][2]:
            return board[i][0]

    for i in range(3):
        if board[0][i] != "" and board[0][i] == board[1][i] == board[2][i]:
            return board[0][i]

    if board[0][0] != "" and board[0][0] == board[1][1] == board[2][2]:
        return board[0][0]

    if board[0][2] != "" and board[0][2] == board[1][1] == board[2][0]:
        return board[0][2]

    return None


def check_draw(board):
    for row in board:
        for cell in row:
            if cell == "":
                return False
    return True


def is_valid_move(board, row, col):
    if row < 0 or row > 2 or col < 0 or col > 2:
        return False
    return board[row][col] == ""


def switch_turn(current_turn):
    return "O" if current_turn == "X" else "X"