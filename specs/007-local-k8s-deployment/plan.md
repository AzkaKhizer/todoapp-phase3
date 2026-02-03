# Implementation Plan: Local Kubernetes Deployment

**Branch**: `007-local-k8s-deployment` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-local-k8s-deployment/spec.md`

## Summary

Deploy the existing Todo Chatbot application (FastAPI backend + Next.js frontend) on a local Kubernetes cluster using Minikube. This involves adapting the existing backend Dockerfile, creating a new frontend Dockerfile, authoring Helm charts for both services, and documenting AI-assisted operations via kubectl-ai and Kagent. The external Neon PostgreSQL database remains unchanged; only the compute layer is containerized and orchestrated.

## Technical Context

**Language/Version**: Python 3.13+ (backend), TypeScript/Node 18+ (frontend)
**Primary Dependencies**: FastAPI, uvicorn, SQLModel, asyncpg (backend); Next.js 15, React 19, Better Auth, Tailwind CSS (frontend)
**Storage**: Neon PostgreSQL (external, cloud-hosted via asyncpg with SSL) — not deployed in-cluster
**Testing**: Manual deployment verification via `kubectl get pods`, health check endpoints, browser access via Minikube IP
**Target Platform**: Local Minikube Kubernetes cluster on Windows (Docker Desktop backend)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: Both pods reach Ready state within 2 minutes; application fully functional via Minikube IP
**Constraints**: No cloud provider resources; all infrastructure local; secrets passed via Kubernetes Secrets (not committed)
**Scale/Scope**: 1-3 replicas per service; single developer local environment

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Spec First | PASS | Spec exists at `specs/007-local-k8s-deployment/spec.md` with 13 FRs, 6 SCs, 4 user stories |
| II. Agent Discipline | PASS | This work falls under devops-agent responsibility (Docker, Kubernetes, Helm) |
| III. Incremental Evolution | PASS | Phases I-III completed; Phase IV builds on existing working application |
| IV. Test-Backed Progress | PASS | Deployment verification via health checks, pod status, browser access defined in spec |
| V. Traceability | PASS | All plan items reference FR-xxx from spec; tasks will map to acceptance scenarios |

**Phase IV Exit Criteria** (from constitution):
- All services deployed to Minikube ✓ (FR-003, FR-004, FR-011)
- Inter-service communication working ✓ (FR-006, SC-004)
- Tests pass ✓ (SC-001 through SC-006)
- QA confirms ✓ (deployment verification in user story 2)

## Project Structure

### Documentation (this feature)

```text
specs/007-local-k8s-deployment/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (deployment topology)
├── quickstart.md        # Phase 1 output (developer setup guide)
├── contracts/           # Phase 1 output (Helm values schema)
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── Dockerfile           # Adapted from existing (port 7860 → PORT env var)
├── .dockerignore        # New: exclude .env, __pycache__, .git
├── app/                 # Existing FastAPI application (unchanged)
├── main.py              # Existing entry point (unchanged)
└── requirements.txt     # Existing dependencies (unchanged)

frontend/
├── Dockerfile           # New: multi-stage Node build for Next.js
├── .dockerignore        # New: exclude node_modules, .env, .next
├── src/                 # Existing Next.js application (unchanged)
├── package.json         # Existing (unchanged)
└── next.config.ts       # Existing (unchanged)

helm/
├── todo-backend/
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── deployment.yaml
│       ├── service.yaml
│       ├── configmap.yaml
│       ├── secret.yaml
│       ├── ingress.yaml (optional)
│       └── _helpers.tpl
└── todo-frontend/
    ├── Chart.yaml
    ├── values.yaml
    └── templates/
        ├── deployment.yaml
        ├── service.yaml
        ├── configmap.yaml
        ├── secret.yaml
        ├── ingress.yaml (optional)
        └── _helpers.tpl
```

**Structure Decision**: The existing `backend/` and `frontend/` directories are preserved as-is. A new `helm/` directory at the project root houses both Helm charts. Dockerfiles live inside their respective service directories. No application code is modified.

## Complexity Tracking

No constitution violations. The plan adds infrastructure files only (Dockerfiles, Helm charts, .dockerignore) without modifying existing application code.

## Phase 0: Research Summary

See [research.md](./research.md) for full details. Key decisions:

1. **Backend Dockerfile**: Adapt existing Dockerfile — change EXPOSE to 8000, keep PORT env var for flexibility. Add .dockerignore.
2. **Frontend Dockerfile**: Multi-stage build (node:18-alpine builder → node:18-alpine runner) with Next.js standalone output for minimal image size.
3. **Helm Chart Pattern**: One chart per service under `helm/` directory. ConfigMaps for non-sensitive config, Secrets for DATABASE_URL, BETTER_AUTH_SECRET, OPENAI_API_KEY.
4. **Image Loading**: Use `minikube image load` to load locally-built images into Minikube (avoids needing a registry).
5. **Ingress**: Use Minikube's built-in NGINX ingress addon for path-based routing.

## Phase 1: Design

### 1.1 Deployment Topology

See [data-model.md](./data-model.md) for the full deployment topology diagram and entity descriptions.

**Services**:
- `todo-backend`: FastAPI on port 8000, 1-3 replicas, connects to external Neon PostgreSQL
- `todo-frontend`: Next.js on port 3000, 1-3 replicas, connects to todo-backend via Kubernetes service DNS

**Networking**:
- Backend Service: ClusterIP on port 8000 (internal)
- Frontend Service: NodePort on port 3000 (exposed via Minikube IP)
- Optional: NGINX Ingress for path-based routing (`/` → frontend, `/api` → backend)

**Secrets Management**:
- Kubernetes Secret `todo-secrets` holds: DATABASE_URL, BETTER_AUTH_SECRET, OPENAI_API_KEY
- Secrets are NOT committed to git; created via `kubectl create secret` or Helm values override

### 1.2 API Contracts (Helm Values)

See [contracts/](./contracts/) for Helm values schemas.

No new application API endpoints are created. The "contracts" for this feature are the Helm chart `values.yaml` files that define the deployment configuration interface.

### 1.3 Developer Quickstart

See [quickstart.md](./quickstart.md) for the complete setup guide.

**Summary**: 8 commands from zero to running application:
1. `minikube start`
2. `minikube addons enable ingress`
3. `docker build` (backend)
4. `docker build` (frontend)
5. `minikube image load` (backend)
6. `minikube image load` (frontend)
7. `helm install todo-backend`
8. `helm install todo-frontend`

## Constitution Re-Check (Post Phase 1)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec First | PASS | All artifacts trace to FR-001 through FR-013 |
| II. Agent Discipline | PASS | devops-agent scope: Docker, Kubernetes, Helm only |
| III. Incremental Evolution | PASS | No application code changes; infrastructure only |
| IV. Test-Backed Progress | PASS | Health probes, pod status, browser verification defined |
| V. Traceability | PASS | Each Helm template maps to specific FRs |

## Risk Analysis

1. **Neon PostgreSQL connectivity from Minikube**: Pods must reach external internet for Neon. Minikube's default networking allows outbound traffic, but corporate proxies or firewalls could block it. **Mitigation**: Document troubleshooting steps for DNS/proxy issues.

2. **Secret management**: `.env` files must NOT be baked into Docker images. **Mitigation**: .dockerignore excludes .env; secrets injected via Kubernetes Secrets.

3. **Image size**: Next.js standalone output keeps frontend image small (~200MB). Backend image is already slim (~300MB with Python). **Mitigation**: Multi-stage builds, .dockerignore.
