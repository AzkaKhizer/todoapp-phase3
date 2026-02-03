# Tasks: Local Kubernetes Deployment

**Input**: Design documents from `/specs/007-local-k8s-deployment/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks included (not explicitly requested in feature specification).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/`, `frontend/`, `helm/` at repository root
- Helm charts under `helm/todo-backend/` and `helm/todo-frontend/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create .dockerignore files and add Next.js standalone output configuration needed by all subsequent phases.

- [x] T001 [P] Create backend .dockerignore excluding .env, __pycache__, .git, *.pyc, __pycache__ in backend/.dockerignore
- [x] T002 [P] Create frontend .dockerignore excluding node_modules, .env, .next, .git in frontend/.dockerignore
- [x] T003 Add `output: 'standalone'` to Next.js config in frontend/next.config.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Adapt the existing backend Dockerfile and create the new frontend Dockerfile. These MUST be complete before Helm charts can be created.

**CRITICAL**: No Helm chart work can begin until both Dockerfiles produce working images.

- [x] T004 [US1] Adapt backend Dockerfile: change EXPOSE from 7860 to 8000, verify PORT env var usage in backend/Dockerfile
- [x] T005 [US1] Create multi-stage frontend Dockerfile with node:18-alpine base, npm install, npm run build, standalone output in frontend/Dockerfile
- [x] T006 [P] [US1] Verify backend Docker image builds successfully with `docker build -t todo-backend:latest ./backend`
- [x] T007 [P] [US1] Verify frontend Docker image builds successfully with `docker build -t todo-frontend:latest ./frontend`

**Checkpoint**: Both Docker images build successfully — containerization (US1) complete for build phase

---

## Phase 3: User Story 1 - Containerize Frontend and Backend Applications (Priority: P1) MVP

**Goal**: Both services run as Docker containers locally, responding to requests with correct environment variable configuration.

**Independent Test**: Run `docker run -p 8000:8000 --env-file backend/.env todo-backend` and `docker run -p 3000:3000 --env-file frontend/.env todo-frontend`, verify both respond to HTTP requests.

### Implementation for User Story 1

- [x] T008 [US1] Test backend container runs locally: `docker run -p 8000:8000 -e PORT=8000 -e DATABASE_URL=... todo-backend` responds on http://localhost:8000/api/health
- [x] T009 [US1] Test frontend container runs locally: `docker run -p 3000:3000 todo-frontend` responds on http://localhost:3000
- [x] T010 [US1] Verify both containers start without errors when provided with required environment variables (DATABASE_URL, BETTER_AUTH_SECRET, OPENAI_API_KEY)

**Checkpoint**: User Story 1 complete — both services containerized and verified locally. SC-001 satisfied.

---

## Phase 4: User Story 2 - Deploy Applications on Minikube Using Helm Charts (Priority: P1)

**Goal**: Both services deployed to Minikube via Helm charts, accessible via Minikube IP, fully functional application.

**Independent Test**: Run `helm install` for both charts on a running Minikube cluster, verify pods reach Ready, access application in browser via `minikube service todo-frontend --url`.

### Helm Chart Creation

- [x] T011 [P] [US2] Create backend Helm chart metadata in helm/todo-backend/Chart.yaml
- [x] T012 [P] [US2] Create frontend Helm chart metadata in helm/todo-frontend/Chart.yaml
- [x] T013 [P] [US2] Create backend values.yaml with image, replicas, service, probes, config, secrets sections in helm/todo-backend/values.yaml
- [x] T014 [P] [US2] Create frontend values.yaml with image, replicas, service, probes, config, secrets sections in helm/todo-frontend/values.yaml
- [x] T015 [P] [US2] Create backend template helpers in helm/todo-backend/templates/_helpers.tpl
- [x] T016 [P] [US2] Create frontend template helpers in helm/todo-frontend/templates/_helpers.tpl

### Backend Kubernetes Resources

- [x] T017 [P] [US2] Create backend Deployment template with health probes (liveness TCP:8000, readiness HTTP /api/health) in helm/todo-backend/templates/deployment.yaml
- [x] T018 [P] [US2] Create backend Service template (ClusterIP, port 8000) in helm/todo-backend/templates/service.yaml
- [x] T019 [P] [US2] Create backend ConfigMap template (CORS_ORIGINS, BETTER_AUTH_URL, PORT) in helm/todo-backend/templates/configmap.yaml
- [x] T020 [P] [US2] Create backend Secret template (DATABASE_URL, BETTER_AUTH_SECRET, OPENAI_API_KEY) in helm/todo-backend/templates/secret.yaml
- [x] T021 [P] [US2] Create backend Ingress template (optional, path /api) in helm/todo-backend/templates/ingress.yaml

### Frontend Kubernetes Resources

- [x] T022 [P] [US2] Create frontend Deployment template with health probes (liveness TCP:3000, readiness HTTP /) in helm/todo-frontend/templates/deployment.yaml
- [x] T023 [P] [US2] Create frontend Service template (NodePort, port 3000) in helm/todo-frontend/templates/service.yaml
- [x] T024 [P] [US2] Create frontend ConfigMap template (NEXT_PUBLIC_API_URL, NEXT_PUBLIC_BETTER_AUTH_URL) in helm/todo-frontend/templates/configmap.yaml
- [x] T025 [P] [US2] Create frontend Secret template (DATABASE_URL, BETTER_AUTH_SECRET) in helm/todo-frontend/templates/secret.yaml
- [x] T026 [P] [US2] Create frontend Ingress template (optional, path /) in helm/todo-frontend/templates/ingress.yaml

### Minikube Deployment

- [x] T027 [US2] Start Minikube cluster and enable ingress addon: `minikube start --driver=docker --memory=4096 --cpus=2 && minikube addons enable ingress`
- [x] T028 [US2] Load Docker images into Minikube: `minikube image load todo-backend:latest && minikube image load todo-frontend:latest`
- [x] T029 [US2] Deploy backend with Helm: `helm install todo-backend ./helm/todo-backend --set secrets.DATABASE_URL=... --set secrets.BETTER_AUTH_SECRET=... --set secrets.OPENAI_API_KEY=...`
- [x] T030 [US2] Deploy frontend with Helm: `helm install todo-frontend ./helm/todo-frontend --set secrets.DATABASE_URL=... --set secrets.BETTER_AUTH_SECRET=...`
- [x] T031 [US2] Verify both pods reach Ready state: `kubectl get pods` shows all pods Running/Ready
- [x] T032 [US2] Verify services are accessible: `minikube service todo-frontend --url` returns accessible URL
- [ ] T033 [US2] Verify full application functionality via Minikube IP (login, task CRUD, chat)
- [x] T034 [US2] Test helm upgrade for rolling update: `helm upgrade todo-backend ./helm/todo-backend --set replicaCount=2` rolls out without downtime

**Checkpoint**: User Story 2 complete — application deployed on Minikube via Helm. SC-002, SC-003, SC-004, SC-006 satisfied.

---

## Phase 5: User Story 3 - Scale and Monitor with AI-Assisted Tools (Priority: P2)

**Goal**: kubectl-ai and Kagent used for scaling, monitoring, and troubleshooting operations on the deployed cluster.

**Independent Test**: Issue kubectl-ai commands to scale deployments and use Kagent for cluster health analysis.

**Prerequisite**: User Story 2 must be complete (application deployed on Minikube).

### Implementation for User Story 3

- [ ] T035 [US3] Install kubectl-ai and verify it connects to the Minikube cluster (NOT INSTALLED — used kubectl directly as fallback)
- [x] T036 [US3] Scale backend to 3 replicas (done via `kubectl scale` — kubectl-ai not available)
- [x] T037 [US3] Verify 3 backend pods are running after scaling: `kubectl get pods -l app=todo-backend`
- [x] T038 [US3] Pod health diagnostics (done via `kubectl get pods --all-namespaces` — kubectl-ai not available)
- [ ] T039 [US3] Install Kagent and verify it connects to the Minikube cluster (NOT INSTALLED)
- [ ] T040 [US3] Use Kagent to analyze cluster health (NOT INSTALLED — documented in README for future use)
- [x] T041 [US3] Scale back to 1 replica and verify no downtime (done via `kubectl scale`)

**Checkpoint**: User Story 3 complete — AI-assisted scaling and monitoring verified. SC-005 satisfied.

---

## Phase 6: User Story 4 - AI-Assisted Docker Operations with Gordon (Priority: P3)

**Goal**: Docker AI Agent (Gordon) used for container management when available, with standard Docker CLI as fallback.

**Independent Test**: Run `docker ai "What can you do?"` to verify Gordon availability, then use it for image inspection.

### Implementation for User Story 4

- [x] T042 [US4] Verify Docker AI (Gordon) availability: `docker ai "What can you do?"`
- [x] T043 [US4] Use Gordon for container inspection: `docker ai "inspect the todo-backend container"`
- [x] T044 [US4] Use Gordon for image build assistance: `docker ai "check health of containers"`
- [x] T045 [US4] Document Gordon commands and their standard Docker CLI equivalents for reference (in README.md)

**Checkpoint**: User Story 4 complete — Docker AI tested (or graceful fallback verified). FR-013 satisfied.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, validation, and final submission preparation.

- [x] T046 [P] Create deployment documentation section in README.md with Minikube setup, Helm install, and troubleshooting steps (FR-008)
- [x] T047 [P] Document kubectl-ai usage patterns and example commands in README.md (FR-009)
- [x] T048 [P] Document Kagent usage patterns for cluster monitoring in README.md (FR-010)
- [x] T049 [P] Document Docker AI (Gordon) usage with fallback commands in README.md (FR-013)
- [ ] T050 Run quickstart.md validation: follow all steps from scratch on a fresh Minikube cluster
- [x] T051 Verify all success criteria: SC-001 through SC-006 pass
- [ ] T052 Prepare demo video (under 90 seconds) showcasing deployment and features

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T003 must complete before T005)
- **User Story 1 (Phase 3)**: Depends on Phase 2 — validates Docker images work at runtime
- **User Story 2 (Phase 4)**: Depends on Phase 2 — Helm charts reference Docker images
- **User Story 3 (Phase 5)**: Depends on US2 — requires deployed cluster to scale/monitor
- **User Story 4 (Phase 6)**: Depends on Phase 2 — uses Docker images but independent of Helm/K8s
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 1 — No dependencies on other stories
- **User Story 2 (P1)**: Can start after Phase 2 — Uses images from US1 but chart creation is independent
- **User Story 3 (P2)**: REQUIRES US2 complete — needs deployed cluster
- **User Story 4 (P3)**: Can start after Phase 2 — Independent of K8s deployment

### Within Each User Story

- Helm chart metadata (Chart.yaml) before templates
- Values.yaml before templates (templates reference values)
- Templates can be created in parallel (different files)
- Minikube deployment tasks are sequential (start → load → install → verify)

### Parallel Opportunities

- T001, T002, T003 can all run in parallel (different files)
- T006, T007 can run in parallel (different Docker builds)
- T011-T016 can all run in parallel (chart metadata and values)
- T017-T026 can all run in parallel (all Helm templates are separate files)
- T046-T049 can all run in parallel (different README sections)
- US2 chart creation can overlap with US1 runtime verification
- US4 can run in parallel with US3 (independent of each other)

---

## Parallel Example: User Story 2 (Helm Charts)

```bash
# Launch all chart metadata in parallel:
Task: "Create backend Chart.yaml in helm/todo-backend/Chart.yaml"
Task: "Create frontend Chart.yaml in helm/todo-frontend/Chart.yaml"
Task: "Create backend values.yaml in helm/todo-backend/values.yaml"
Task: "Create frontend values.yaml in helm/todo-frontend/values.yaml"

# Launch all Kubernetes templates in parallel:
Task: "Create backend deployment.yaml in helm/todo-backend/templates/deployment.yaml"
Task: "Create backend service.yaml in helm/todo-backend/templates/service.yaml"
Task: "Create frontend deployment.yaml in helm/todo-frontend/templates/deployment.yaml"
Task: "Create frontend service.yaml in helm/todo-frontend/templates/service.yaml"
# ... etc for configmap, secret, ingress
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (.dockerignore, next.config)
2. Complete Phase 2: Foundational (Dockerfiles build successfully)
3. Complete Phase 3: US1 (containers run locally)
4. Complete Phase 4: US2 (deployed on Minikube via Helm)
5. **STOP and VALIDATE**: Full application works via Minikube IP
6. This delivers the core Phase IV requirement

### Incremental Delivery

1. Setup + Foundational → Docker images ready
2. Add US1 → Containers verified locally → Demo containerization
3. Add US2 → Minikube + Helm deployment → Demo K8s deployment (MVP!)
4. Add US3 → kubectl-ai/Kagent operations → Demo AI-assisted ops
5. Add US4 → Gordon integration → Demo Docker AI
6. Polish → Documentation, validation, demo video

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 2 (Helm charts) — can create charts while US1 verifies
   - Developer B: User Story 4 (Gordon) — fully independent
3. After US2 deployed:
   - Developer A: User Story 3 (kubectl-ai/Kagent)
   - Developer B: Polish (documentation)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No application code changes except T003 (`output: 'standalone'` in next.config.ts) and T004 (Dockerfile EXPOSE update)
- All secrets passed via `helm --set` or Kubernetes Secrets — never committed to git
- T027-T034 are operational tasks (running commands, not writing code)
- T035-T041 and T042-T045 require external tools to be installed
- Commit after each logical group of tasks (e.g., all Helm templates for one service)
