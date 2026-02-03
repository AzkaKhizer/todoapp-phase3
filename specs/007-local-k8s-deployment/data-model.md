# Deployment Topology: Local Kubernetes Deployment

**Feature**: 007-local-k8s-deployment
**Date**: 2026-02-02

## Topology Diagram

```text
┌─────────────────────────────────────────────────────────────┐
│                    Minikube Cluster                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  NGINX Ingress                        │   │
│  │  /api/* → todo-backend:8000                          │   │
│  │  /*     → todo-frontend:3000                         │   │
│  └──────────┬───────────────────────────┬───────────────┘   │
│             │                           │                   │
│  ┌──────────▼──────────┐  ┌────────────▼────────────────┐  │
│  │  todo-backend (svc)  │  │  todo-frontend (svc)        │  │
│  │  ClusterIP:8000      │  │  NodePort:3000              │  │
│  └──────────┬──────────┘  └────────────┬────────────────┘  │
│             │                           │                   │
│  ┌──────────▼──────────┐  ┌────────────▼────────────────┐  │
│  │  Deployment          │  │  Deployment                 │  │
│  │  1-3 replicas        │  │  1-3 replicas               │  │
│  │  FastAPI:8000        │  │  Next.js:3000               │  │
│  │                      │  │                              │  │
│  │  Env from:           │  │  Env from:                   │  │
│  │  - todo-backend-cm   │  │  - todo-frontend-cm          │  │
│  │  - todo-secrets      │  │  - todo-secrets               │  │
│  └──────────┬──────────┘  └─────────────────────────────┘  │
│             │                                               │
└─────────────┼───────────────────────────────────────────────┘
              │ (outbound)
              ▼
    ┌─────────────────────┐
    │  Neon PostgreSQL     │
    │  (External Cloud)    │
    │  SSL/TLS Required    │
    └─────────────────────┘
```

## Kubernetes Resources

### 1. Deployment: todo-backend

| Property | Value | Spec Ref |
|----------|-------|----------|
| Image | `todo-backend:latest` | FR-001 |
| Replicas | 1 (default), configurable 1-3 | FR-005 |
| Container Port | 8000 | FR-001 |
| Liveness Probe | TCP socket :8000, period 10s | FR-007 |
| Readiness Probe | HTTP GET /api/health :8000, period 5s | FR-007 |
| Env (ConfigMap) | CORS_ORIGINS, BETTER_AUTH_URL, PORT | FR-006 |
| Env (Secret) | DATABASE_URL, BETTER_AUTH_SECRET, OPENAI_API_KEY | FR-006 |
| Resource Limits | CPU: 500m, Memory: 512Mi | — |
| Resource Requests | CPU: 100m, Memory: 256Mi | — |

### 2. Deployment: todo-frontend

| Property | Value | Spec Ref |
|----------|-------|----------|
| Image | `todo-frontend:latest` | FR-002 |
| Replicas | 1 (default), configurable 1-3 | FR-005 |
| Container Port | 3000 | FR-002 |
| Liveness Probe | TCP socket :3000, period 10s | FR-007 |
| Readiness Probe | HTTP GET / :3000, period 5s | FR-007 |
| Env (ConfigMap) | NEXT_PUBLIC_API_URL, NEXT_PUBLIC_BETTER_AUTH_URL | FR-006 |
| Env (Secret) | DATABASE_URL, BETTER_AUTH_SECRET | FR-006 |
| Resource Limits | CPU: 500m, Memory: 512Mi | — |
| Resource Requests | CPU: 100m, Memory: 256Mi | — |

### 3. Service: todo-backend

| Property | Value | Spec Ref |
|----------|-------|----------|
| Type | ClusterIP | FR-003 |
| Port | 8000 | FR-003 |
| Target Port | 8000 | FR-003 |
| Selector | app: todo-backend | FR-003 |

### 4. Service: todo-frontend

| Property | Value | Spec Ref |
|----------|-------|----------|
| Type | NodePort | FR-004, FR-011 |
| Port | 3000 | FR-004 |
| Target Port | 3000 | FR-004 |
| Selector | app: todo-frontend | FR-004 |

### 5. ConfigMap: todo-backend-config

| Key | Default Value | Spec Ref |
|-----|---------------|----------|
| CORS_ORIGINS | `http://todo-frontend:3000` | FR-006 |
| BETTER_AUTH_URL | `http://todo-frontend:3000` | FR-006 |
| PORT | `8000` | FR-006 |

### 6. ConfigMap: todo-frontend-config

| Key | Default Value | Spec Ref |
|-----|---------------|----------|
| NEXT_PUBLIC_API_URL | `http://todo-backend:8000/api` | FR-006 |
| NEXT_PUBLIC_BETTER_AUTH_URL | `http://todo-frontend:3000` | FR-006 |

### 7. Secret: todo-secrets

| Key | Source | Spec Ref |
|-----|--------|----------|
| DATABASE_URL | User-provided (Neon connection string) | FR-006 |
| BETTER_AUTH_SECRET | User-provided (64-char hex) | FR-006 |
| OPENAI_API_KEY | User-provided (sk-proj-...) | FR-006 |

### 8. Ingress: todo-ingress (Optional)

| Property | Value | Spec Ref |
|----------|-------|----------|
| Class | nginx | FR-011 |
| Rule: /api/* | → todo-backend:8000 | FR-011 |
| Rule: /* | → todo-frontend:3000 | FR-011 |

## Docker Images

### todo-backend

| Property | Value |
|----------|-------|
| Base Image | python:3.11-slim |
| Build Context | `backend/` |
| Exposed Port | 8000 |
| Entry Command | `python main.py` |
| Expected Size | ~300MB |

### todo-frontend

| Property | Value |
|----------|-------|
| Base Image | node:18-alpine (multi-stage) |
| Build Context | `frontend/` |
| Build Output | Next.js standalone |
| Exposed Port | 3000 |
| Entry Command | `node server.js` |
| Expected Size | ~200MB |

## Environment Variable Flow

```text
Developer's .env files
        │
        ▼
kubectl create secret / helm --set
        │
        ▼
┌───────────────────────┐
│ Kubernetes Secret     │
│ (todo-secrets)        │
│ - DATABASE_URL        │
│ - BETTER_AUTH_SECRET  │
│ - OPENAI_API_KEY      │
└───────┬───────────────┘
        │ envFrom / env
        ▼
┌───────────────────────┐    ┌───────────────────────┐
│ Backend Pod           │    │ Frontend Pod           │
│ reads DATABASE_URL    │    │ reads DATABASE_URL     │
│ reads AUTH_SECRET     │    │ reads AUTH_SECRET       │
│ reads OPENAI_API_KEY  │    │                        │
└───────────────────────┘    └───────────────────────┘
```

**Critical Constraint**: `BETTER_AUTH_SECRET` must be identical between frontend and backend pods. This is enforced by both reading from the same Kubernetes Secret.
