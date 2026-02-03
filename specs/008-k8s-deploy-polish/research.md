# Research: K8s Deploy Polish & Validation

**Feature**: 008-k8s-deploy-polish
**Date**: 2026-02-02

## Current State Analysis

### What's Already Done (from 007-local-k8s-deployment)

- **Docker images**: Both `todo-backend:latest` and `todo-frontend:latest` build successfully
- **Helm charts**: Complete charts for both services with deployments, services, configmaps, secrets, ingress
- **Minikube deployment**: Successfully deployed and verified on running cluster
- **Scaling**: Tested 1->3->1 replica scaling with zero downtime
- **Docker AI (Gordon)**: Verified working for image inspection and health guidance
- **README Phase IV section**: Already written with prerequisites, quick start, Helm chart table, scaling, AI tools, troubleshooting

### What Remains

| Item | Status | Blocker |
|------|--------|---------|
| Fresh cluster quickstart validation (T050) | Not done | Requires `minikube delete` + full re-deploy |
| Full app functionality test (T033) | Not done | Requires browser-based manual testing |
| kubectl-ai installation | Not available | Not in winget/choco; optional tool |
| Kagent installation | Not available | Not in winget/choco; optional tool |
| Demo video (T052) | Not done | Requires screen recording (manual) |
| Helm lint validation | Not done | Quick automated check |

## Research Findings

### Decision 1: Quickstart Command Count

**Decision**: Current quickstart uses 6 numbered steps (some with sub-commands on separate lines). Actual distinct commands: 8 (build x2, start, enable ingress, load x2, helm x2). Adding port-forward makes 9-10.

**Rationale**: 8-10 commands fits within the "10 or fewer" constraint (SC-001/SC-002). Port-forward is needed on Docker driver since NodePort isn't directly accessible.

**Alternatives considered**: Using `minikube tunnel` instead of port-forward (adds complexity), using a deploy script (reduces command count but hides complexity).

### Decision 2: kubectl-ai and Kagent Availability

**Decision**: Document as optional tools with standard kubectl fallback commands.

**Rationale**: Neither kubectl-ai nor Kagent is available via standard Windows package managers. The spec allows graceful fallback.

**Alternatives considered**: Building from source (too complex for quickstart), using Docker images of the tools (adds Docker-in-Docker complexity).

### Decision 3: Demo Video Approach

**Decision**: Create a demo script document with timing. Actual recording is manual.

**Rationale**: Screen recording cannot be automated via CLI. A scripted outline ensures the video stays under 90 seconds and covers all required segments.

**Alternatives considered**: Automated terminal recording with asciinema (doesn't capture browser UI), gif recording (no audio, limited).

### Decision 4: Troubleshooting Depth

**Decision**: Cover 6 common issues with specific error messages and resolution commands.

**Rationale**: Exceeds the SC-005 requirement of "at least 5 common issues." Based on actual issues encountered during deployment.

**Alternatives considered**: Minimal 5 issues (doesn't cover enough ground), FAQ format (less structured than diagnostic commands).

## Tools Verified

| Tool | Version | Status |
|------|---------|--------|
| Docker Desktop | 29.1.5 | Working |
| Minikube | 1.38.0 | Working |
| Helm | 4.1.0 | Working |
| kubectl | via Docker Desktop | Working |
| Docker AI (Gordon) | Built into Docker Desktop | Working |
| kubectl-ai | N/A | Not installed |
| Kagent | N/A | Not installed |
