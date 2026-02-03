# Data Model: K8s Deployment Topology

**Feature**: 008-k8s-deploy-polish
**Date**: 2026-02-02

## Deployment Topology

This feature involves no new data entities. The deployment topology documents the Kubernetes resources managed by Helm charts.

### Kubernetes Resources

```
Minikube Cluster (Docker driver)
├── Namespace: default
│   ├── Deployment: todo-backend (1 replica)
│   │   └── Pod: todo-backend-*
│   │       ├── Container: python:3.11-slim
│   │       ├── Port: 8000
│   │       ├── Liveness: TCP :8000
│   │       ├── Readiness: HTTP GET /api/health :8000
│   │       ├── ConfigMap: todo-backend (CORS_ORIGINS, BETTER_AUTH_URL, PORT)
│   │       └── Secret: todo-backend (DATABASE_URL, BETTER_AUTH_SECRET, OPENAI_API_KEY)
│   ├── Service: todo-backend (ClusterIP, port 8000)
│   ├── Deployment: todo-frontend (1 replica)
│   │   └── Pod: todo-frontend-*
│   │       ├── Container: node:18-alpine (standalone Next.js)
│   │       ├── Port: 3000
│   │       ├── Liveness: TCP :3000
│   │       ├── Readiness: HTTP GET / :3000
│   │       ├── ConfigMap: todo-frontend (NEXT_PUBLIC_API_URL, NEXT_PUBLIC_BETTER_AUTH_URL)
│   │       └── Secret: todo-frontend (DATABASE_URL, BETTER_AUTH_SECRET)
│   └── Service: todo-frontend (NodePort, port 3000)
├── Namespace: ingress-nginx
│   └── Deployment: ingress-nginx-controller
└── Namespace: kube-system
    └── [standard Minikube system pods]
```

### Network Flow

```
Developer Browser (localhost)
    │
    ├── :3000 (port-forward) ──→ Service: todo-frontend ──→ Pod: todo-frontend
    │                                                           │
    │                                                           │ (NEXT_PUBLIC_API_URL)
    │                                                           ▼
    └── :8000 (port-forward) ──→ Service: todo-backend ──→ Pod: todo-backend
                                                               │
                                                               ▼
                                                        Neon PostgreSQL (external)
```

### Helm Release Structure

| Release | Chart | Revision | Namespace |
|---------|-------|----------|-----------|
| todo-backend | helm/todo-backend | 2 | default |
| todo-frontend | helm/todo-frontend | 1 | default |
