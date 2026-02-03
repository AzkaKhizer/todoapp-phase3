# Tasks: K8s Deploy Polish & Validation

**Input**: Design documents from `/specs/008-k8s-deploy-polish/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: No test tasks included (this feature is documentation and validation, not code).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/`, `frontend/`, `helm/` at repository root
- Documentation in `README.md` and `specs/008-k8s-deploy-polish/`

---

## Phase 1: Setup

**Purpose**: Ensure prerequisites are met and current deployment state is known.

- [x] T001 Verify Docker Desktop is running: `docker --version` and `docker info`
- [x] T002 Verify Minikube is installed: `minikube version`
- [x] T003 Verify Helm is installed: `helm version`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Validate that existing Helm charts pass linting before any deployment.

- [x] T004 Lint backend Helm chart: `helm lint ./helm/todo-backend`
- [x] T005 [P] Lint frontend Helm chart: `helm lint ./helm/todo-frontend`
- [x] T006 Verify Docker images build: `docker build -t todo-backend:latest ./backend && docker build -t todo-frontend:latest ./frontend`

**Checkpoint**: All Helm charts valid, Docker images build successfully.

---

## Phase 3: User Story 1 - Quickstart Validation (Priority: P1) MVP

**Goal**: Validate the quickstart guide deploys a working application on a fresh Minikube cluster in 10 or fewer commands.

**Independent Test**: Follow quickstart.md from scratch. All pods Ready, app accessible at localhost:3000.

### Implementation for User Story 1

- [x] T007 [US1] Delete existing Minikube cluster: `minikube delete`
- [x] T008 [US1] Start fresh Minikube cluster: `minikube start --driver=docker`
- [x] T009 [US1] Enable ingress addon: `minikube addons enable ingress`
- [x] T010 [US1] Load backend image into Minikube: `minikube image load todo-backend:latest`
- [x] T011 [US1] Load frontend image into Minikube: `minikube image load todo-frontend:latest`
- [x] T012 [US1] Deploy backend with Helm using secrets from backend/.env: `helm upgrade --install todo-backend ./helm/todo-backend --set secrets.DATABASE_URL=... --set secrets.BETTER_AUTH_SECRET=... --set secrets.OPENAI_API_KEY=...`
- [x] T013 [US1] Deploy frontend with Helm using secrets from frontend/.env: `helm upgrade --install todo-frontend ./helm/todo-frontend --set secrets.DATABASE_URL=... --set secrets.BETTER_AUTH_SECRET=...`
- [x] T014 [US1] Wait for pods to reach Ready state: `kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=120s && kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=120s`
- [x] T015 [US1] Set up port-forwarding: `kubectl port-forward svc/todo-backend 8000:8000 & kubectl port-forward svc/todo-frontend 3000:3000 &`
- [x] T016 [US1] Verify backend health endpoint responds: `curl http://localhost:8000/api/health` returns 200
- [x] T017 [US1] Verify frontend loads: open http://localhost:3000 in browser, confirm page renders
- [x] T018 [US1] Count total commands in quickstart and confirm <= 10
- [x] T019 [US1] Record validation results in specs/008-k8s-deploy-polish/quickstart.md validation table

**Checkpoint**: US1 complete. Fresh Minikube cluster with working app in <= 10 commands. SC-001, SC-002 satisfied.

---

## Phase 4: User Story 2 - Deployment Documentation (Priority: P1)

**Goal**: README.md contains complete, accurate deployment documentation with prerequisites, Helm charts, AI tools, and troubleshooting.

**Independent Test**: A new developer reads only README.md and can deploy + troubleshoot the application.

### Implementation for User Story 2

- [x] T020 [P] [US2] Review README.md Phase IV section and verify prerequisites list includes Docker Desktop, Minikube, Helm, kubectl with install commands (FR-002) in README.md
- [x] T021 [P] [US2] Verify README.md has Helm chart reference table with chart names, services, ports, and types (FR-003) in README.md
- [x] T022 [P] [US2] Verify README.md has scaling instructions with kubectl commands (FR-004) in README.md
- [x] T023 [P] [US2] Verify README.md documents kubectl-ai commands with kubectl fallbacks (FR-005) in README.md
- [x] T024 [P] [US2] Verify README.md documents Kagent commands for cluster monitoring (FR-006) in README.md
- [x] T025 [P] [US2] Verify README.md documents Docker AI (Gordon) commands with Docker CLI fallbacks (FR-007) in README.md
- [x] T026 [US2] Expand troubleshooting section to cover at least 6 common issues with specific error messages and resolution commands (FR-008) in README.md:
  1. Pod CrashLoopBackOff (missing or incorrect secrets)
  2. Service not accessible from host (port-forward needed on Docker driver)
  3. Image not found in Minikube (forgot `minikube image load`)
  4. Docker Desktop not running when starting Minikube
  5. Port already in use on host (3000 or 8000 occupied)
  6. Ingress not working (addon not enabled or tunnel not running)
- [x] T027 [US2] Add port-forward instructions after Quick Start section since NodePort is not directly accessible on Docker driver in README.md

**Checkpoint**: US2 complete. README has all required documentation sections. SC-002 (documentation sections), SC-005 (5+ troubleshooting items) satisfied.

---

## Phase 5: User Story 3 - Success Criteria Verification (Priority: P1)

**Goal**: All 6 original success criteria verified with documented evidence.

**Independent Test**: Run each SC test and record pass/fail with command output.

### Implementation for User Story 3

- [x] T028 [US3] Verify SC-001: Both Docker images build successfully — run `docker build` for both and capture success output
- [x] T029 [US3] Verify SC-002: Fresh Minikube to running app in <= 10 commands — count commands from quickstart validation (T018)
- [x] T030 [US3] Verify SC-003: Services reach Ready within 2 minutes — time from Helm install to pod Ready (T014 output)
- [x] T031 [US3] Verify SC-004: Full app functionality via localhost — test login, create task, update task, delete task, toggle complete, AI chat (manual browser test)
- [x] T032 [US3] Verify SC-005: Scale backend 1->3 replicas without downtime — `kubectl scale deployment todo-backend --replicas=3` then verify all 3 pods Running and original pod preserved
- [x] T033 [US3] Verify SC-006: Helm upgrade without pod recreation — `helm upgrade todo-backend ./helm/todo-backend --reuse-values` then verify pod name and age unchanged
- [x] T034 [US3] Document all SC results in specs/008-k8s-deploy-polish/success-criteria-evidence.md with command outputs

**Checkpoint**: US3 complete. All 6 success criteria pass. SC-003 satisfied.

---

## Phase 6: User Story 4 - Demo Video Preparation (Priority: P2)

**Goal**: Demo video script prepared; video recorded under 90 seconds.

**Independent Test**: Script covers deployment, login, CRUD, chat, scaling in 85-second target.

### Implementation for User Story 4

- [x] T035 [US4] Create demo video script in specs/008-k8s-deploy-polish/demo-script.md with timing for each segment:
  - Intro + prerequisites (10s)
  - Docker build + Minikube start (15s)
  - Helm deploy + pod Ready (15s)
  - App walkthrough: register, login, CRUD (20s)
  - AI chat demo (10s)
  - Scaling demo: 1->3 replicas (10s)
  - Closing (5s)
- [ ] T036 [US4] Record demo video following the script (manual — screen recording tool required)
- [ ] T037 [US4] Verify video is under 90 seconds and covers all required features (login, CRUD, chat, deployment)

**Checkpoint**: US4 complete. Demo video recorded and validated. SC-004 satisfied.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, commit preparation, and overall validation.

- [x] T038 [P] Scale backend back to 1 replica after SC-005 testing: `kubectl scale deployment todo-backend --replicas=1`
- [x] T039 Verify all tasks.md checkboxes from 007-local-k8s-deployment are updated to reflect completion status in specs/007-local-k8s-deployment/tasks.md
- [x] T040 Run final `kubectl get pods,svc` to confirm clean cluster state
- [ ] T041 Commit all documentation and validation artifacts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (tools must be available)
- **User Story 1 (Phase 3)**: Depends on Phase 2 — needs valid charts and images
- **User Story 2 (Phase 4)**: Can start after Phase 2 — independent of US1
- **User Story 3 (Phase 5)**: Depends on US1 — needs deployed cluster for verification
- **User Story 4 (Phase 6)**: Depends on US1 and US3 — needs working deployment + verified criteria
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — MVP quickstart validation
- **User Story 2 (P1)**: Can start after Foundational — Independent documentation review
- **User Story 3 (P1)**: REQUIRES US1 complete — needs deployed cluster to verify SC
- **User Story 4 (P2)**: REQUIRES US1 + US3 — needs working app + verified criteria for demo

### Within Each User Story

- US1: Sequential (deploy steps must run in order)
- US2: Mostly parallel (different README sections can be reviewed simultaneously)
- US3: Mostly sequential (some SC tests depend on deployment state)
- US4: Sequential (script before recording before verification)

### Parallel Opportunities

- T001, T002, T003 can run in parallel (tool verification)
- T004, T005 can run in parallel (different Helm charts)
- T020-T025 can run in parallel (different README sections)
- US1 and US2 can run in parallel after foundational phase
- T028-T033 are mostly independent SC verifications (some need deployment state)

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1: Setup (verify tools)
2. Complete Phase 2: Foundational (lint charts, build images)
3. Complete Phase 3: US1 (quickstart validation on fresh cluster)
4. **STOP and VALIDATE**: App works end-to-end from fresh Minikube
5. This proves the deployment is reproducible

### Incremental Delivery

1. Setup + Foundational -> Tools verified, charts valid
2. Add US1 -> Quickstart validated -> Fresh cluster works (MVP!)
3. Add US2 -> Documentation complete -> README covers everything
4. Add US3 -> Success criteria verified -> Evidence documented
5. Add US4 -> Demo video recorded -> Presentation ready
6. Polish -> Clean state, committed

### Parallel Strategy

With two parallel tracks:
1. Track A: US1 (quickstart validation) then US3 (SC verification)
2. Track B: US2 (documentation review/enhancement)
3. After both tracks: US4 (demo video needs both)

---

## Notes

- [P] tasks = different files or independent operations, no dependencies
- [Story] label maps task to specific user story for traceability
- No application code changes in this feature — documentation and validation only
- All secrets passed via `helm --set` — never committed to git
- T036 (demo video recording) is manual and requires screen recording software
- kubectl-ai and Kagent are not installed; documented as optional with fallbacks
- Docker AI (Gordon) is available and verified working
- Commit after each phase completion
