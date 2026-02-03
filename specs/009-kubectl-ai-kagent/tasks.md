# Tasks: kubectl-ai and Kagent AI-Assisted Operations

**Input**: Design documents from `/specs/009-kubectl-ai-kagent/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: No test tasks included (this feature is CLI operations and validation, not code).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact commands or file paths in descriptions

## Path Conventions

- **CLI Tools**: kubectl-ai, kagent (installed globally)
- **Documentation**: `README.md` at repository root
- **Cluster**: Minikube (default namespace)

---

## Phase 1: Setup

**Purpose**: Verify prerequisites and prepare environment for AI tool installation.

- [x] T001 Verify Docker Desktop is running: `docker --version` and `docker info`
- [x] T002 Verify Minikube cluster is running: `minikube status`
- [x] T003 Verify kubectl is configured: `kubectl config current-context` shows minikube
- [x] T004 Verify Helm is installed: `helm version`
- [x] T005 Verify backend and frontend deployments exist: `kubectl get deployments`

---

## Phase 2: Foundational (kubectl-ai Installation)

**Purpose**: Install and configure kubectl-ai as prerequisite for US1-US3.

**⚠️ CRITICAL**: kubectl-ai must be installed before any AI-assisted scaling/health check operations.

- [x] T006 Install kubectl-ai via curl installer: `curl -sSL https://raw.githubusercontent.com/GoogleCloudPlatform/kubectl-ai/main/install.sh | bash`
- [x] T007 Add kubectl-ai to PATH if needed: `export PATH="$HOME/.local/bin:$PATH"`
- [x] T008 Verify kubectl-ai installation: `kubectl-ai --version`
- [x] T009 Configure Gemini API key: `export GEMINI_API_KEY="your-api-key"`
- [x] T010 Test kubectl-ai connection to cluster: `kubectl ai "list all pods"`

**Checkpoint**: kubectl-ai installed and communicating with Minikube cluster.

---

## Phase 3: User Story 1 - Scale Services with kubectl-ai (Priority: P1) MVP

**Goal**: Use natural language commands via kubectl-ai to scale frontend and backend services to 3 replicas with zero downtime.

**Independent Test**: Run kubectl-ai scale commands and verify pod counts match expectations using `kubectl get pods`.

### Implementation for User Story 1

- [x] T011 [US1] Record initial pod count: `kubectl get pods -l app=todo-backend` and `kubectl get pods -l app=todo-frontend`
- [x] T012 [US1] Scale backend to 3 replicas using kubectl-ai: `kubectl ai "scale the todo-backend deployment to 3 replicas"`
- [x] T013 [US1] Verify backend scaling completed within 60 seconds: `kubectl get pods -l app=todo-backend` shows 3 Running pods
- [x] T014 [US1] Scale frontend to 3 replicas using kubectl-ai: `kubectl ai "scale the todo-frontend deployment to 3 replicas"`
- [x] T015 [US1] Verify frontend scaling completed within 60 seconds: `kubectl get pods -l app=todo-frontend` shows 3 Running pods
- [x] T016 [US1] Verify zero downtime during scaling: at least one pod remained Running throughout (check RESTARTS column)
- [x] T017 [US1] Document kubectl fallback for scaling in README.md: `kubectl scale deployment <name> --replicas=3`

**Checkpoint**: US1 complete. Both services scaled to 3 replicas via kubectl-ai. SC-001, SC-002 satisfied.

---

## Phase 4: User Story 2 - Check Pod Health with kubectl-ai (Priority: P1)

**Goal**: Use kubectl-ai to check health status of pods using natural language queries.

**Independent Test**: Run kubectl-ai health check commands and verify output shows pod names, ready states, and restart counts.

### Implementation for User Story 2

- [x] T018 [US2] Check health of all pods using kubectl-ai: `kubectl ai "check the health of all pods in the default namespace"`
- [x] T019 [US2] Compare kubectl-ai output with standard kubectl: `kubectl get pods -o wide`
- [x] T020 [US2] Check specifically for backend pod health: `kubectl ai "check the health of the todo-backend pods"`
- [x] T021 [US2] Check specifically for frontend pod health: `kubectl ai "check the health of the todo-frontend pods"`
- [x] T022 [US2] Verify output includes pod name, ready state, and restart count
- [x] T023 [US2] Document kubectl fallback for health checks in README.md: `kubectl get pods -o wide`

**Checkpoint**: US2 complete. kubectl-ai health checks return accurate pod status. SC-003 satisfied.

---

## Phase 5: User Story 3 - Analyze Cluster Resources with kubectl-ai (Priority: P2)

**Goal**: Use kubectl-ai to analyze resource allocation and get optimization suggestions.

**Independent Test**: Run resource analysis command and verify it returns CPU/memory usage data.

### Implementation for User Story 3

- [x] T024 [US3] Check cluster resource allocation: `kubectl ai "check the resource allocation of the cluster"`
- [x] T025 [US3] Request specific CPU usage analysis: `kubectl ai "which pods are using the most CPU?"`
- [x] T026 [US3] Request memory usage analysis: `kubectl ai "show memory usage for all pods"`
- [x] T027 [US3] Request optimization suggestions: `kubectl ai "suggest resource optimizations for the cluster"`
- [x] T028 [US3] Document kubectl fallback for resource checks in README.md: `kubectl top pods` and `kubectl top nodes`

**Checkpoint**: US3 complete. kubectl-ai provides resource analysis. SC-003 satisfied.

---

## Phase 6: Kagent Installation (Prerequisites for US4-US5)

**Purpose**: Install and configure Kagent as prerequisite for US4-US5.

- [x] T029 Install Kagent CLI: `curl https://raw.githubusercontent.com/kagent-dev/kagent/refs/heads/main/scripts/get-kagent | bash`
- [x] T030 Verify Kagent CLI installation: `kagent --version`
- [x] T031 Deploy Kagent to Minikube cluster with minimal profile: `kagent install --profile minimal`
- [x] T032 Wait for Kagent pods to be ready: `kubectl get pods -n kagent`
- [x] T033 Verify Kagent dashboard is accessible: `kagent dashboard` (opens browser)

**Checkpoint**: Kagent installed and running in cluster.

---

## Phase 7: User Story 4 - Analyze Cluster Health with Kagent (Priority: P2)

**Goal**: Use Kagent to perform comprehensive cluster health analysis including node status and resource utilization.

**Independent Test**: Run Kagent analysis and verify it returns node health, CPU/memory utilization, and bottleneck warnings.

### Implementation for User Story 4

- [x] T034 [US4] Open Kagent dashboard: `kagent dashboard`
- [x] T035 [US4] Run cluster health analysis via Kagent dashboard: Ask "analyze the cluster health"
- [x] T036 [US4] Verify output includes node health status
- [x] T037 [US4] Verify output includes CPU utilization metrics
- [x] T038 [US4] Verify output includes memory utilization metrics
- [x] T039 [US4] Document Kagent workflow in README.md

**Checkpoint**: US4 complete. Kagent provides cluster health analysis. SC-004 satisfied.

---

## Phase 8: User Story 5 - Optimize Cluster with Kagent Recommendations (Priority: P3)

**Goal**: Get and optionally apply Kagent optimization recommendations.

**Independent Test**: Verify Kagent provides actionable recommendations with commands to execute.

### Implementation for User Story 5

- [x] T040 [US5] Request optimization recommendations via Kagent: Ask "suggest resource optimizations"
- [x] T041 [US5] Review recommendations provided by Kagent
- [x] T042 [US5] If safe recommendations exist, apply one optimization (e.g., adjust replica count)
- [x] T043 [US5] Verify cluster state after optimization: `kubectl get pods,svc`
- [x] T044 [US5] Document Kagent optimization workflow in README.md

**Checkpoint**: US5 complete. Kagent provides optimization recommendations. SC-004 satisfied.

---

## Phase 9: Polish & Documentation

**Purpose**: Final cleanup, documentation, and success criteria verification.

- [x] T045 [P] Scale services back to 1 replica: `kubectl scale deployment todo-backend --replicas=1 && kubectl scale deployment todo-frontend --replicas=1`
- [x] T046 [P] Update README.md with complete AI tools section including all kubectl fallbacks (FR-008, SC-005)
- [x] T047 Verify all success criteria documented with evidence
- [x] T048 Run quickstart.md validation - all installation steps work
- [x] T049 Verify all 5 user stories can be demonstrated end-to-end (SC-006)
- [ ] T050 Commit all documentation updates

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - verify existing infrastructure
- **Foundational (Phase 2)**: Depends on Phase 1 - installs kubectl-ai
- **US1, US2, US3 (Phases 3-5)**: Depend on Phase 2 (kubectl-ai installed)
- **Kagent Installation (Phase 6)**: Can start after Phase 2 or in parallel with Phases 3-5
- **US4, US5 (Phases 7-8)**: Depend on Phase 6 (Kagent installed)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after kubectl-ai installed (Phase 2)
- **User Story 2 (P1)**: Can start after kubectl-ai installed (Phase 2) - parallel with US1
- **User Story 3 (P2)**: Can start after kubectl-ai installed (Phase 2) - parallel with US1, US2
- **User Story 4 (P2)**: Can start after Kagent installed (Phase 6)
- **User Story 5 (P3)**: Depends on US4 completion (needs cluster analysis first)

### Within Each User Story

- Verify tool is working before operations
- Execute AI commands
- Verify results match expectations
- Document kubectl fallback commands

### Parallel Opportunities

- T001, T002, T003, T004, T005 can run in parallel (verification tasks)
- US1, US2, US3 can run in parallel after kubectl-ai installed
- Kagent installation (Phase 6) can run in parallel with US1-US3
- T045, T046 can run in parallel (cleanup tasks)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify prerequisites)
2. Complete Phase 2: Foundational (install kubectl-ai)
3. Complete Phase 3: User Story 1 (scaling with kubectl-ai)
4. **STOP and VALIDATE**: Scaling works via natural language
5. Demo: "kubectl ai 'scale todo-backend to 3 replicas'" works

### Incremental Delivery

1. Setup + Foundational → kubectl-ai installed
2. Add US1 → Scaling works → Demo kubectl-ai scaling (MVP!)
3. Add US2 → Health checks work → Demo kubectl-ai health
4. Add US3 → Resource analysis works → Demo kubectl-ai optimization
5. Add Kagent + US4 → Cluster analysis works → Demo Kagent dashboard
6. Add US5 → Optimization applied → Demo complete workflow
7. Polish → Documentation complete → Ready for review

### Parallel Strategy

With kubectl-ai installed:
- Track A: US1 (scaling) → US4 (Kagent health)
- Track B: US2 (health checks) → US5 (Kagent optimization)
- Track C: US3 (resource analysis)

After all tracks: Polish phase

---

## Notes

- [P] tasks = independent operations, no dependencies
- [Story] label maps task to specific user story for traceability
- All AI tool commands have documented kubectl fallbacks
- Scaling operations must verify zero downtime
- Kagent requires cluster deployment (not just CLI)
- API keys required: Gemini (free tier) or OpenAI
- All operations target existing Minikube cluster from Phase IV
- Commit after each user story completion
