# CloudPlay

CloudPlay is a cloud-based gaming project built around a multiplayer Tic Tac Toe experience. It combines a React frontend, a FastAPI backend, and AWS infrastructure to demonstrate how a simple game can be deployed with load balancing, auto scaling, and shared session storage.

## What This Project Includes

- A modern browser UI built with React, Vite, and Tailwind CSS
- A FastAPI backend that manages Tic Tac Toe game sessions
- Persistent session storage in DynamoDB with TTL-based cleanup
- AWS infrastructure for an Application Load Balancer and Auto Scaling Group
- A legacy Python Tkinter desktop client kept in the repo for earlier project work

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Python
- FastAPI
- Uvicorn
- Boto3
- DynamoDB

### Cloud / DevOps
- AWS EC2
- AWS Application Load Balancer
- AWS Auto Scaling Group
- Terraform

## Project Structure

This repository contains multiple parts of the CloudPlay system. The most important active pieces today are the React frontend in `frontend/`, the FastAPI backend in `Server/main.py`, and the AWS infrastructure files in `terraform/`.

```text
CloudPlay/
├── Client/
│   ├── api.py
│   ├── app.py
│   └── game.py
├── Server/
│   ├── main.py
│   ├── requirements.txt
│   ├── game_logic.py
│   ├── models.py
│   ├── storage.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── session_models.py
│   ├── routes/
│   │   ├── __init__.py
│   │   └── session.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── game_service.py
│   └── store/
│       ├── __init__.py
│       └── memory_store.py
├── Shared/
│   └── constant.py
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       │   └── Navbar.jsx
│       └── pages/
│           ├── Landing.jsx
│           ├── Games.jsx
│           ├── TicTacToe.jsx
│           └── About.jsx
├── terraform/
│   ├── README.md
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
└── README.md
```

### Root Files

- [README.md](/Users/neelitaliya/Desktop/CloudPlay/README.md): Main project documentation.

### `frontend/` - Web Client

This is the browser-based user interface for CloudPlay. It is built with React and bundled with Vite.

- [frontend/package.json](/Users/neelitaliya/Desktop/CloudPlay/frontend/package.json): Frontend dependencies and scripts such as `npm run dev` and `npm run build`.
- [frontend/vite.config.js](/Users/neelitaliya/Desktop/CloudPlay/frontend/vite.config.js): Vite configuration.
- [frontend/tailwind.config.js](/Users/neelitaliya/Desktop/CloudPlay/frontend/tailwind.config.js): Tailwind CSS configuration.
- [frontend/postcss.config.js](/Users/neelitaliya/Desktop/CloudPlay/frontend/postcss.config.js): PostCSS setup for Tailwind processing.
- [frontend/index.html](/Users/neelitaliya/Desktop/CloudPlay/frontend/index.html): HTML shell loaded by Vite.
- [frontend/src/main.jsx](/Users/neelitaliya/Desktop/CloudPlay/frontend/src/main.jsx): React entry point that mounts the app.
- [frontend/src/App.jsx](/Users/neelitaliya/Desktop/CloudPlay/frontend/src/App.jsx): Top-level app component; manages page navigation between home, games, play, and about views.
- [frontend/src/index.css](/Users/neelitaliya/Desktop/CloudPlay/frontend/src/index.css): Global styles.
- [frontend/src/components/Navbar.jsx](/Users/neelitaliya/Desktop/CloudPlay/frontend/src/components/Navbar.jsx): Shared navigation bar used across the frontend.
- [frontend/src/pages/Landing.jsx](/Users/neelitaliya/Desktop/CloudPlay/frontend/src/pages/Landing.jsx): Home page and project introduction.
- [frontend/src/pages/Games.jsx](/Users/neelitaliya/Desktop/CloudPlay/frontend/src/pages/Games.jsx): Game selection screen.
- [frontend/src/pages/TicTacToe.jsx](/Users/neelitaliya/Desktop/CloudPlay/frontend/src/pages/TicTacToe.jsx): Main Tic Tac Toe gameplay UI. This file currently contains the frontend `BASE_URL` used for backend API calls.
- [frontend/src/pages/About.jsx](/Users/neelitaliya/Desktop/CloudPlay/frontend/src/pages/About.jsx): Architecture and tech-stack explanation page.

### `Server/` - Backend API

This folder contains the Python backend. The current active app entry point is [Server/main.py](/Users/neelitaliya/Desktop/CloudPlay/Server/main.py).

- [Server/main.py](/Users/neelitaliya/Desktop/CloudPlay/Server/main.py): Active FastAPI application. Defines API routes, Tic Tac Toe rules, DynamoDB integration, CORS settings, session TTL handling, and health checks.
- [Server/requirements.txt](/Users/neelitaliya/Desktop/CloudPlay/Server/requirements.txt): Python dependencies required to run the backend.

The remaining files and subfolders represent earlier or alternate backend organization:

- [Server/game_logic.py](/Users/neelitaliya/Desktop/CloudPlay/Server/game_logic.py): Reusable Tic Tac Toe helper functions for board creation, winner detection, draw detection, and turn switching. This appears to be from an earlier design with a 3x3 nested board.
- [Server/storage.py](/Users/neelitaliya/Desktop/CloudPlay/Server/storage.py): Very small in-memory game store from an older backend iteration.
- [Server/models.py](/Users/neelitaliya/Desktop/CloudPlay/Server/models.py): Older model file kept in the repo.

#### `Server/models/`

- [Server/models/session_models.py](/Users/neelitaliya/Desktop/CloudPlay/Server/models/session_models.py): Pydantic models for session requests and responses used by the older modular backend structure.
- [Server/models/__init__.py](/Users/neelitaliya/Desktop/CloudPlay/Server/models/__init__.py): Package marker for the `models` module.

#### `Server/routes/`

- [Server/routes/session.py](/Users/neelitaliya/Desktop/CloudPlay/Server/routes/session.py): Session route definitions for the older router-based backend layout.
- [Server/routes/__init__.py](/Users/neelitaliya/Desktop/CloudPlay/Server/routes/__init__.py): Package marker for routes.

#### `Server/services/`

- [Server/services/game_service.py](/Users/neelitaliya/Desktop/CloudPlay/Server/services/game_service.py): In-memory game/session service used by the older route-based backend version.
- [Server/services/__init__.py](/Users/neelitaliya/Desktop/CloudPlay/Server/services/__init__.py): Package marker for services.

#### `Server/store/`

- [Server/store/memory_store.py](/Users/neelitaliya/Desktop/CloudPlay/Server/store/memory_store.py): Temporary in-memory session store for the older backend flow.
- [Server/store/__init__.py](/Users/neelitaliya/Desktop/CloudPlay/Server/store/__init__.py): Package marker for store utilities.

### `Client/` - Legacy Desktop Client

This folder contains an older Python desktop client built with Tkinter. It is useful as reference or fallback UI code, but it is not the main interface for the current project.

- [Client/app.py](/Users/neelitaliya/Desktop/CloudPlay/Client/app.py): Tkinter desktop interface for starting and playing a game through API calls.
- [Client/api.py](/Users/neelitaliya/Desktop/CloudPlay/Client/api.py): Helper functions for talking to an older backend API shape such as `/create-game` and `/make-move`.
- [Client/game.py](/Users/neelitaliya/Desktop/CloudPlay/Client/game.py): Another Tkinter-based desktop client version that talks to `/session/*` endpoints and uses a hard-coded server URL.

### `Shared/` - Shared Helpers

- [Shared/constant.py](/Users/neelitaliya/Desktop/CloudPlay/Shared/constant.py): Placeholder shared constants file. It is currently empty.

### `terraform/` - Infrastructure as Code

This folder contains the AWS infrastructure definition used to deploy the backend behind a load balancer with auto scaling.

- [terraform/main.tf](/Users/neelitaliya/Desktop/CloudPlay/terraform/main.tf): Creates the ALB, target group, listener, launch template, Auto Scaling Group, and scaling policy.
- [terraform/variables.tf](/Users/neelitaliya/Desktop/CloudPlay/terraform/variables.tf): Stores infrastructure variables such as region, AMI ID, VPC ID, instance type, and IAM instance profile.
- [terraform/outputs.tf](/Users/neelitaliya/Desktop/CloudPlay/terraform/outputs.tf): Outputs values such as the ALB DNS name and ASG details after `terraform apply`.
- [terraform/README.md](/Users/neelitaliya/Desktop/CloudPlay/terraform/README.md): Usage guide for applying and destroying the infrastructure.

### Structure Summary

- `frontend/` is the main user-facing application.
- `Server/main.py` is the current backend entry point.
- `terraform/` manages deployment infrastructure.
- `Client/` and several modular files inside `Server/` are legacy or alternate implementations kept in the repository for reference.

## How It Works

1. A player opens the CloudPlay frontend in the browser.
2. The frontend starts a new Tic Tac Toe session through the FastAPI backend.
3. The backend stores the board state, active turn, and winner data in DynamoDB.
4. Players make moves through API calls.
5. In deployment, traffic can be routed through an AWS ALB to healthy EC2 instances in an Auto Scaling Group.

## Current Gameplay Features

- Two-player Tic Tac Toe
- Player name entry before starting a match
- Turn tracking for X and O
- Win and draw detection
- Session-based game state
- Health endpoint for infrastructure checks

## Local Development

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd CloudPlay
```

### 2. Run the backend

Create and activate a virtual environment if needed, then install dependencies:

```bash
cd Server
pip install -r requirements.txt
```

Start the API server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend expects access to DynamoDB. These environment variables are supported:

```bash
export AWS_REGION=ap-south-1
export DYNAMODB_TABLE=cloudplay-sessions
```

If you are running locally without the deployed AWS resources, make sure your AWS credentials and DynamoDB table are configured first.

### 3. Run the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

By default, the Tic Tac Toe page currently points to a deployed backend URL in [frontend/src/pages/TicTacToe.jsx](/Users/neelitaliya/Desktop/CloudPlay/frontend/src/pages/TicTacToe.jsx). For local development, update `BASE_URL` in that file to:

```js
const BASE_URL = "http://localhost:8000";
```

### 4. Open the app

After Vite starts, open the local URL it prints, usually:

```text
http://localhost:5173
```

## Backend API

The current backend in [Server/main.py](/Users/neelitaliya/Desktop/CloudPlay/Server/main.py) exposes these routes:

- `GET /` - basic service message
- `GET /health` - app and DynamoDB health check
- `POST /session/start` - create a new game session
- `GET /session/{session_id}` - fetch a session state
- `POST /session/move` - submit a move
- `POST /session/end` - delete a session
- `GET /sessions` - count active sessions

### Example: start a session

```bash
curl -X POST http://localhost:8000/session/start \
  -H "Content-Type: application/json" \
  -d '{"player_x":"Alice","player_o":"Bob"}'
```

## Deployment and Terraform

The `terraform/` folder provisions infrastructure for the deployed backend, including:

- An Application Load Balancer
- A target group with `/health` checks on port `8000`
- A launch template for EC2 instances
- An Auto Scaling Group
- A target-tracking scaling policy based on ALB request count

See [terraform/README.md](/Users/neelitaliya/Desktop/CloudPlay/terraform/README.md) for the deployment workflow.

## Notes About Repo State

- The main, current backend implementation uses DynamoDB for sessions.
- Some frontend copy still mentions Redis because it reflects an earlier architecture description.
- The desktop client in [Client/app.py](/Users/neelitaliya/Desktop/CloudPlay/Client/app.py) talks to older endpoints and should be treated as legacy unless updated to match the current FastAPI API.
- The Terraform files currently contain hard-coded values and should be cleaned up before sharing publicly or using in production.

## Future Improvements

- Add more games to the platform
- Move frontend API base URL to environment variables
- Add automated tests for backend routes and game logic
- Align all docs/UI copy with the current DynamoDB-based architecture
- Add authentication and player history

## Author

Built as a cloud computing project to demonstrate game deployment on scalable AWS infrastructure.
