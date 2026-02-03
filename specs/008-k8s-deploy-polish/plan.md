# Implementation Plan: K8s Deploy Polish & Validation

**Branch**: `008-k8s-deploy-polish` | **Date**: 2026-02-02 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/008-k8s-deploy-polish/spec.md`

## Summary

Complete the Phase 4 local Kubernetes deployment by validating the quickstart guide on a fresh Minikube cluster, enhancing README documentation with comprehensive deployment instructions (including AI-assisted tools and troubleshooting), verifying all 6 success criteria with evidence, and preparing a demo video script.

## Technical Context

**Language/Version**: Bash/Shell scripting, Markdown documentation
**Primary Dependencies**: Minikube v1.38.0, Helm v4.1.0, Docker Desktop 29.x, kubectl
**Storage**: N/A (documentation and validation only)
**Testing**: Manual validation against success criteria checklist
**Target Platform**: Windows 10/11 with Docker Desktop, Minikube (Docker driver)
**Project Type**: Web application (existing backend + frontend)
**Performance Goals**: All services Ready within 2 minutes of deployment
**Constraints**: 10 or fewer commands for quickstart, demo video under 90 seconds
**Scale/Scope**: Single-node Minikube cluster, 2 services (backend + frontend)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Spec First | PASS | Spec exists at `specs/008-k8s-deploy-polish/spec.md` with 11 FRs, 5 SCs |
| II. Agent Discipline | PASS | devops-agent scope: Docker, Kubernetes, Helm |
| III. Incremental Evolution | PASS | Phase IV built on completed Phases I-III; 007 deployment done |
| IV. Test-Backed Progress | PASS | Success criteria serve as validation tests for this documentation/validation feature |
| V. Traceability | PASS | All tasks map to FR-001 through FR-011 and SC-001 through SC-006 |

No violations. No complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/008-k8s-deploy-polish/
├── plan.md              # This file
├── research.md          # Phase 0: current state analysis
├── data-model.md        # Phase 1: deployment topology
├── quickstart.md        # Phase 1: validated quickstart guide
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
backend/
├── Dockerfile           # Existing - Python 3.11-slim, port 8000
├── .dockerignore        # Existing
└── ...

frontend/
├── Dockerfile           # Existing - Multi-stage node:18-alpine, standalone
├── .dockerignore        # Existing
└── ...

helm/
├── todo-backend/        # Existing Helm chart
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/       # deployment, service, configmap, secret, ingress
└── todo-frontend/       # Existing Helm chart
    ├── Chart.yaml
    ├── values.yaml
    └── templates/       # deployment, service, configmap, secret, ingress

README.md                # Target: enhanced Phase IV documentation
```

**Structure Decision**: No new source code directories needed. This feature modifies only documentation files (README.md, quickstart.md) and creates validation artifacts.

## Implementation Approach

### Phase A: Quickstart Validation (US1, FR-001, FR-011)

1. Delete existing Minikube cluster (`minikube delete`)
2. Follow quickstart steps from README verbatim on fresh cluster
3. Record each step's output as validation evidence
4. Verify pod readiness, service accessibility, and app functionality
5. Count total commands (must be <= 10)
6. Document any issues found and fix quickstart if needed

### Phase B: Documentation Enhancement (US2, FR-002 through FR-008)

1. Review current README Phase IV section against all FR requirements
2. Enhance prerequisites section with installation commands for all platforms
3. Verify Helm chart reference table accuracy
4. Expand troubleshooting section to cover at least 5 common issues:
   - Pod CrashLoopBackOff (missing secrets)
   - Service not accessible (port-forward needed on Docker driver)
   - Image not found in Minikube (forgot `minikube image load`)
   - Docker Desktop not running
   - Port already in use
5. Verify kubectl-ai, Kagent, and Gordon documentation sections exist with fallbacks

### Phase C: Success Criteria Verification (US3, FR-009)

Run through each of the 6 original success criteria and document evidence:

| Criteria | Test | Evidence |
|----------|------|----------|
| SC-001 | Docker build both images | Build logs showing success |
| SC-002 | Count quickstart commands | Command count <= 10 |
| SC-003 | Time to Ready after deploy | Pod Ready within 2 min |
| SC-004 | App functionality check | Login, CRUD, chat working |
| SC-005 | Scale 1->3 replicas | Zero downtime during scale |
| SC-006 | Helm upgrade no pod restart | Pod name/age preserved |

### Phase D: Demo Video Preparation (US4, FR-010)

1. Create a demo script document with timing for each segment
2. Segment breakdown (target 85 seconds):
   - Intro + prerequisites (10s)
   - Docker build + Minikube start (15s)
   - Helm deploy (15s)
   - App walkthrough: login + CRUD (20s)
   - AI chat demo (10s)
   - Scaling demo (10s)
   - Closing (5s)
3. Video recording is manual (outside scope of automation)

## Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| Network issues during fresh cluster validation | Cannot pull images | Pre-load images; document proxy setup |
| NEXT_PUBLIC_API_URL baked at build time | Frontend can't reach backend via different URL | Document that frontend must be rebuilt if backend URL changes |
| kubectl-ai/Kagent not installable | Phase 5 tasks incomplete | Document as optional; provide kubectl fallbacks |
| Demo video over 90 seconds | Fails FR-010 | Pre-script with timing; cut non-essential segments |

## Dependencies

- **Existing**: All 007-local-k8s-deployment work (Dockerfiles, Helm charts, deployment verified)
- **External**: Docker Desktop running, internet for Minikube base image pull
- **Tools**: Minikube v1.38.0, Helm v4.1.0, Docker AI (Gordon)
