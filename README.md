# The Evolution of Todo: Spec-Driven, Agentic AI Development

A hackathon project demonstrating the evolution from a simple console application to a full-stack web application using Spec-Driven Development (SDD).

## Phases

### Phase I: Todo Console Application
A Python console-based todo application with in-memory storage.

```bash
cd todo
uv run python -m todo
```

### Phase II: Todo Full-Stack Web Application
A modern, full-stack todo application with FastAPI backend and Next.js frontend.

## Phase II Features

- User registration and authentication with JWT tokens
- Create, read, update, and delete tasks
- Toggle task completion status
- Multi-user isolation (users can only see their own tasks)
- Responsive design with dark mode support
- Type-safe API with Pydantic schemas

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLModel** - SQL database ORM with Pydantic integration
- **PostgreSQL** (Neon) - Cloud database
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling

## Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL database (or Neon account)
- UV (Python package manager)
- pnpm (Node.js package manager)

## Setup

### Backend Setup

```bash
cd backend

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials:
# DATABASE_URL=postgresql+asyncpg://user:pass@host/db
# JWT_SECRET=your-secret-key
# JWT_EXPIRY_HOURS=24
# CORS_ORIGINS=http://localhost:3000

# Install dependencies with UV
uv sync

# Run the backend
uv run uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

### Frontend Setup

```bash
cd frontend

# Copy environment variables
cp .env.example .env

# Edit .env:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Install dependencies with pnpm
pnpm install

# Run the development server
pnpm dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Tasks
- `GET /api/tasks` - List all tasks (paginated)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get single task
- `PUT /api/tasks/{id}` - Full update task
- `PATCH /api/tasks/{id}` - Partial update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/toggle` - Toggle completion

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── config.py          # Environment configuration
│   │   ├── database.py        # Database connection
│   │   ├── exceptions.py      # Custom exceptions
│   │   ├── main.py            # FastAPI application
│   │   ├── dependencies/      # FastAPI dependencies
│   │   ├── models/            # SQLModel models
│   │   ├── routers/           # API routes
│   │   ├── schemas/           # Pydantic schemas
│   │   └── services/          # Business logic
│   └── tests/                 # Backend tests
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js pages
│   │   ├── components/        # React components
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   └── lib/               # Utilities
│   └── __tests__/             # Frontend tests
├── helm/
│   ├── todo-backend/          # Backend Helm chart
│   └── todo-frontend/         # Frontend Helm chart
├── specs/                     # Design specifications
└── todo/                      # Phase I console app
```

## Phase IV: Local Kubernetes Deployment

Deploy the full-stack application on a local Minikube cluster using Helm charts.

### Prerequisites

- Docker Desktop (running)
- Minikube (`winget install Kubernetes.minikube`)
- Helm (`winget install Helm.Helm`)
- kubectl (included with Docker Desktop)

### Quick Start

```bash
# 1. Build Docker images
docker build -t todo-backend:latest ./backend
docker build -t todo-frontend:latest ./frontend

# 2. Start Minikube and enable ingress
minikube start --driver=docker
minikube addons enable ingress

# 3. Load images into Minikube
minikube image load todo-backend:latest
minikube image load todo-frontend:latest

# 4. Deploy backend (replace secrets with your values)
helm upgrade --install todo-backend ./helm/todo-backend \
  --set secrets.DATABASE_URL="your-database-url" \
  --set secrets.BETTER_AUTH_SECRET="your-auth-secret" \
  --set secrets.OPENAI_API_KEY="your-openai-key"

# 5. Deploy frontend
helm upgrade --install todo-frontend ./helm/todo-frontend \
  --set secrets.DATABASE_URL="your-database-url" \
  --set secrets.BETTER_AUTH_SECRET="your-auth-secret"

# 6. Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=120s
kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=120s

# 7. Access the application (port-forward required on Docker driver)
kubectl port-forward svc/todo-backend 8000:8000 &
kubectl port-forward svc/todo-frontend 3000:3000 &
```

Open http://localhost:3000 in your browser. Backend API is at http://localhost:8000.

> **Note:** On the Docker driver, NodePort services are not directly accessible from the host. Port-forwarding is required to access the application at localhost.

### Helm Charts

| Chart | Service | Port | Type |
|-------|---------|------|------|
| `helm/todo-backend` | FastAPI API | 8000 | ClusterIP |
| `helm/todo-frontend` | Next.js App | 3000 | NodePort |

### Scaling

```bash
# Scale backend to 3 replicas
kubectl scale deployment todo-backend --replicas=3

# Verify pods
kubectl get pods -l app=todo-backend

# Scale back
kubectl scale deployment todo-backend --replicas=1
```

### AI-Assisted Operations (Phase V)

Use natural language to manage your Kubernetes cluster with kubectl-ai and Kagent.

#### Installing kubectl-ai

```bash
# Windows (Git Bash)
mkdir -p ~/.local/bin
curl -sLO "https://github.com/GoogleCloudPlatform/kubectl-ai/releases/latest/download/kubectl-ai_Windows_x86_64.zip"
unzip kubectl-ai_Windows_x86_64.zip -d ~/.local/bin
rm kubectl-ai_Windows_x86_64.zip
export PATH="$HOME/.local/bin:$PATH"

# Verify installation
kubectl-ai version

# Set API key (OpenAI or Gemini)
export OPENAI_API_KEY="your-key"  # or GEMINI_API_KEY
```

#### kubectl-ai Commands

```bash
# Scaling (US1)
kubectl-ai --llm-provider=openai --quiet --skip-permissions "scale the todo-backend deployment to 3 replicas"
kubectl-ai --llm-provider=openai --quiet --skip-permissions "scale the todo-frontend deployment to 3 replicas"

# Health checks (US2)
kubectl-ai --llm-provider=openai --quiet --skip-permissions "check the health of all pods in the default namespace"
kubectl-ai --llm-provider=openai --quiet --skip-permissions "show the status of todo-backend pods including restart count"

# Resource analysis (US3)
kubectl-ai --llm-provider=openai --quiet --skip-permissions "check the resource allocation and suggest optimizations for this kubernetes cluster"
```

**Standard kubectl fallbacks:**
```bash
# Scaling
kubectl scale deployment todo-backend --replicas=3
kubectl scale deployment todo-frontend --replicas=3

# Health checks
kubectl get pods -o wide
kubectl describe pod -l app=todo-backend

# Resource analysis
kubectl top nodes
kubectl top pods
kubectl get deployments -o json | jq '.items[].spec.template.spec.containers[].resources'
```

#### Installing Kagent

```bash
# Windows
curl -sL "https://github.com/kagent-dev/kagent/releases/latest/download/kagent-windows-amd64.exe" -o ~/.local/bin/kagent.exe

# Verify installation
kagent version

# Deploy to cluster (requires OPENAI_API_KEY)
export OPENAI_API_KEY="your-key"
kagent install --profile minimal

# Open dashboard
kagent dashboard
```

#### Kagent Commands (US4, US5)

```bash
# Cluster health analysis
kagent "analyze the cluster health and provide feedback on resource usage"

# Resource optimization
kagent "suggest resource optimizations for better cluster performance"
```

**Standard kubectl fallbacks:**
```bash
# Cluster health
kubectl get nodes -o wide
kubectl top nodes
kubectl top pods --all-namespaces
kubectl get events --sort-by=.lastTimestamp | head -20

# Resource analysis
kubectl describe nodes | grep -A 5 "Allocated resources"
kubectl get resourcequotas --all-namespaces
```

#### Docker AI (Gordon)

```bash
# Verify Gordon availability
docker ai ask "What can you do?"

# Inspect images
docker ai ask "Inspect the todo-backend:latest image and suggest optimizations"

# Container health
docker ai ask "Show me how to check the health of my running containers"
```

**Standard Docker CLI fallbacks:**
```bash
docker inspect todo-backend:latest
docker stats --no-stream
docker logs --tail 50 <container-id>
```

### Troubleshooting

#### 1. Pod CrashLoopBackOff (missing or incorrect secrets)
```
STATUS: CrashLoopBackOff   RESTARTS: 3
```
```bash
kubectl logs deployment/todo-backend --tail=50   # Check error message
kubectl describe pod -l app=todo-backend          # Check Events section
# Fix: Redeploy with correct secrets
helm upgrade todo-backend ./helm/todo-backend --set secrets.DATABASE_URL="..." --set secrets.BETTER_AUTH_SECRET="..." --set secrets.OPENAI_API_KEY="..."
```

#### 2. Service not accessible from host (port-forward needed)
```
curl: (7) Failed to connect to localhost port 3000
```
```bash
# On Docker driver, NodePort is not directly accessible. Use port-forward:
kubectl port-forward svc/todo-frontend 3000:3000 &
kubectl port-forward svc/todo-backend 8000:8000 &
```

#### 3. Image not found in Minikube (forgot `minikube image load`)
```
ErrImageNeverPull / ImagePullBackOff
```
```bash
minikube image load todo-backend:latest
minikube image load todo-frontend:latest
kubectl rollout restart deployment/todo-backend
kubectl rollout restart deployment/todo-frontend
```

#### 4. Docker Desktop not running when starting Minikube
```
Exiting due to PROVIDER_DOCKER_NOT_RUNNING
```
Start Docker Desktop from the Windows Start menu and wait for it to finish loading, then retry `minikube start --driver=docker`.

#### 5. Port already in use on host (3000 or 8000 occupied)
```
Unable to listen on port 3000: Listeners failed to create
```
```bash
# Find and kill the process using the port (Windows)
netstat -ano | findstr :3000
taskkill /PID <pid> /F
# Then retry port-forward
kubectl port-forward svc/todo-frontend 3000:3000 &
```

#### 6. Ingress not working (addon not enabled or tunnel not running)
```
connection refused / 404 from ingress
```
```bash
minikube addons enable ingress
kubectl get pods -n ingress-nginx   # Wait for controller to be Running
# If using ingress with Docker driver, start the tunnel:
minikube tunnel
```

#### General Debugging

```bash
kubectl get pods -o wide              # Check pod status
kubectl get svc                       # Check services
kubectl describe pod <pod-name>       # Check events
kubectl logs deployment/todo-backend --tail=50
kubectl rollout restart deployment/todo-backend
helm uninstall todo-backend && helm uninstall todo-frontend  # Full redeploy
```

## Running Tests

### Phase I Tests
```bash
uv run pytest
```

### Backend Tests
```bash
cd backend
uv run pytest
```

### Frontend Tests
```bash
cd frontend
pnpm test
```

## License

MIT License
