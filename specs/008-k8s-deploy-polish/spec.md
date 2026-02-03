# Feature Specification: Local K8s Deployment - Polish & Validation

**Feature Branch**: `008-k8s-deploy-polish`
**Created**: 2026-02-02
**Status**: Draft
**Input**: User description: "Phase 4 remaining tasks: quickstart validation, documentation, demo video, success criteria verification"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Quickstart Validation (Priority: P1)

A developer clones the repository on a machine with Docker Desktop installed and follows the quickstart guide to deploy the full application on a fresh Minikube cluster. The guide must produce a working deployment with frontend, backend, and ingress all accessible from localhost.

**Why this priority**: Without a validated quickstart, no one can reproduce the deployment. This is the foundation for all other deliverables.

**Independent Test**: Follow every step in the quickstart guide on a fresh Minikube cluster. The application must be accessible and fully functional (login, task CRUD, chat) from a browser at localhost.

**Acceptance Scenarios**:

1. **Given** a machine with Docker Desktop and no existing Minikube cluster, **When** the developer follows the quickstart guide step-by-step, **Then** both frontend and backend pods reach Ready state and the application is accessible via port-forward or NodePort.
2. **Given** a running Minikube deployment, **When** the developer accesses the frontend URL, **Then** they can register, log in, create/read/update/delete tasks, and use the AI chat feature.
3. **Given** a running Minikube deployment, **When** the developer runs `kubectl get pods`, **Then** all pods show `1/1 Running` status with zero crash loops.

---

### User Story 2 - Deployment Documentation (Priority: P1)

A developer reads the README.md and finds complete, accurate instructions for setting up Minikube, installing via Helm, using AI-assisted tools (kubectl-ai, Kagent, Docker AI Gordon), and troubleshooting common issues.

**Why this priority**: Documentation is essential for reproducibility and is a core deliverable of Phase 4.

**Independent Test**: A new developer can read the README section and understand prerequisites, setup steps, available AI tools, and troubleshooting commands without external help.

**Acceptance Scenarios**:

1. **Given** the README.md, **When** a developer reads the Phase IV section, **Then** they find prerequisites, quick start commands, Helm chart references, scaling instructions, AI tool usage, and troubleshooting steps.
2. **Given** the README.md, **When** a developer encounters a common issue (pod not starting, service not accessible, port-forward failing), **Then** they find a relevant troubleshooting command in the documentation.
3. **Given** the README.md, **When** a developer wants to use kubectl-ai, Kagent, or Docker AI Gordon, **Then** they find example commands with both AI-assisted and standard CLI fallback alternatives.

---

### User Story 3 - Success Criteria Verification (Priority: P1)

All six success criteria from the original spec (SC-001 through SC-006) are verified and documented with evidence of passing.

**Why this priority**: Success criteria validation proves the feature is complete and meets its defined goals.

**Independent Test**: Run through each success criterion and record pass/fail with evidence.

**Acceptance Scenarios**:

1. **Given** Docker images for backend and frontend, **When** `docker build` is run, **Then** both images build successfully (SC-001).
2. **Given** a fresh Minikube cluster, **When** the quickstart commands are followed, **Then** the application is running in fewer than 10 commands (SC-002).
3. **Given** a Helm deployment, **When** pods are created, **Then** all services reach Ready within 2 minutes (SC-003).
4. **Given** a running deployment, **When** the application is accessed via Minikube IP/port-forward, **Then** login, task CRUD, and chat all function correctly (SC-004).
5. **Given** a running deployment, **When** backend is scaled from 1 to 3 replicas, **Then** scaling completes without downtime (SC-005).
6. **Given** a deployed Helm release, **When** `helm upgrade` is run with unchanged config, **Then** pods are not recreated (SC-006).

---

### User Story 4 - Demo Video (Priority: P2)

A short demo video (under 90 seconds) is prepared that showcases the deployment process, key application features, and AI-assisted operations.

**Why this priority**: The demo video is a deliverable but depends on all other stories being complete first.

**Independent Test**: The video is under 90 seconds, shows deployment, login, CRUD, chat, and scaling.

**Acceptance Scenarios**:

1. **Given** a screen recording tool, **When** the demo is recorded, **Then** it shows Minikube deployment, application access, and at least one AI tool interaction in under 90 seconds.
2. **Given** the demo video, **When** a reviewer watches it, **Then** they can see the application running on Kubernetes with working features.

---

### Edge Cases

- What happens when Minikube cannot pull base images due to network restrictions? Documentation must include a note about proxy configuration.
- What happens when ports 3000 or 8000 are already in use on the host machine? Troubleshooting section must cover port conflicts.
- What happens when secrets are not provided during Helm install? Pods should fail with clear error messages, documented in troubleshooting.
- What happens when Docker Desktop is not running when `minikube start` is executed? Error handling guidance must be included.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Quickstart guide MUST deploy both frontend and backend on a fresh Minikube cluster in 10 or fewer commands.
- **FR-002**: README MUST include prerequisites section listing Docker Desktop, Minikube, Helm, and kubectl with installation commands.
- **FR-003**: README MUST include Helm chart reference table showing chart names, services, ports, and service types.
- **FR-004**: README MUST include scaling instructions with kubectl commands for replica management.
- **FR-005**: README MUST document kubectl-ai example commands with standard kubectl fallbacks.
- **FR-006**: README MUST document Kagent example commands for cluster health monitoring.
- **FR-007**: README MUST document Docker AI (Gordon) commands with standard Docker CLI equivalents as fallbacks.
- **FR-008**: README MUST include troubleshooting section covering pod failures, service access issues, and port-forward problems.
- **FR-009**: All six success criteria (SC-001 through SC-006) MUST be verified with documented evidence.
- **FR-010**: Demo video MUST be under 90 seconds and show deployment, login, CRUD operations, and chat functionality.
- **FR-011**: Quickstart guide MUST be validated by running all steps from scratch on a clean Minikube cluster.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can go from a clean Minikube to a fully working application in 10 or fewer commands by following the quickstart guide.
- **SC-002**: README documentation covers all required sections: prerequisites, quick start, Helm charts, scaling, AI tools (3 tools), and troubleshooting.
- **SC-003**: All 6 original success criteria from the Phase 4 spec pass verification with documented evidence.
- **SC-004**: Demo video is recorded, is under 90 seconds, and demonstrates deployment plus at least 3 application features.
- **SC-005**: Troubleshooting section addresses at least 5 common deployment issues with resolution commands.

## Assumptions

- Docker Desktop is installed and running on the developer's machine.
- The developer has internet access for pulling base container images.
- Secrets (DATABASE_URL, BETTER_AUTH_SECRET, OPENAI_API_KEY) are available to the developer.
- kubectl-ai and Kagent may not be installed; documentation provides both AI-assisted and standard CLI alternatives.
- Docker AI (Gordon) is available through Docker Desktop.
- The demo video will be recorded using external screen recording software (not automatable by CLI).
