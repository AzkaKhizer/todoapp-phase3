# Quickstart: Local Kubernetes Deployment

**Feature**: 008-k8s-deploy-polish
**Validated**: 2026-02-02

## Prerequisites

| Tool | Install Command | Verify |
|------|----------------|--------|
| Docker Desktop | [docker.com/desktop](https://docker.com/products/docker-desktop) | `docker --version` |
| Minikube | `winget install Kubernetes.minikube` | `minikube version` |
| Helm | `winget install Helm.Helm` | `helm version` |
| kubectl | Included with Docker Desktop | `kubectl version --client` |

## Deploy in 8 Commands

```bash
# 1. Build Docker images
docker build -t todo-backend:latest ./backend
docker build -t todo-frontend:latest ./frontend

# 2. Start Minikube
minikube start --driver=docker

# 3. Enable ingress addon
minikube addons enable ingress

# 4. Load images into Minikube
minikube image load todo-backend:latest
minikube image load todo-frontend:latest

# 5. Deploy backend (replace with your actual secrets)
helm upgrade --install todo-backend ./helm/todo-backend \
  --set secrets.DATABASE_URL="postgresql+asyncpg://user:pass@host/db?sslmode=require" \
  --set secrets.BETTER_AUTH_SECRET="your-32-char-secret" \
  --set secrets.OPENAI_API_KEY="sk-your-key"

# 6. Deploy frontend (replace with your actual secrets)
helm upgrade --install todo-frontend ./helm/todo-frontend \
  --set secrets.DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" \
  --set secrets.BETTER_AUTH_SECRET="your-32-char-secret"

# 7. Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=120s
kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=120s

# 8. Access the application
kubectl port-forward svc/todo-backend 8000:8000 &
kubectl port-forward svc/todo-frontend 3000:3000 &
```

Open http://localhost:3000 in your browser.

## Verify Deployment

```bash
# Check all pods are running
kubectl get pods

# Expected output:
# NAME                             READY   STATUS    RESTARTS   AGE
# todo-backend-xxx                 1/1     Running   0          Xm
# todo-frontend-xxx                1/1     Running   0          Xm

# Check services
kubectl get svc

# Check backend health
curl http://localhost:8000/api/health
```

## Teardown

```bash
helm uninstall todo-backend
helm uninstall todo-frontend
minikube stop
minikube delete  # optional: removes cluster entirely
```

## Validation Status

| Step | Command | Result |
|------|---------|--------|
| Build backend | `docker build -t todo-backend:latest ./backend` | SUCCESS |
| Build frontend | `docker build -t todo-frontend:latest ./frontend` | SUCCESS |
| Start Minikube | `minikube start --driver=docker` | SUCCESS |
| Enable ingress | `minikube addons enable ingress` | SUCCESS |
| Load backend image | `minikube image load todo-backend:latest` | SUCCESS |
| Load frontend image | `minikube image load todo-frontend:latest` | SUCCESS |
| Deploy backend | `helm upgrade --install todo-backend ...` | SUCCESS (Rev 1) |
| Deploy frontend | `helm upgrade --install todo-frontend ...` | SUCCESS (Rev 1) |
| Pods Ready | `kubectl get pods` | Both 1/1 Running |
| Backend health | `/api/health` returns 200 | SUCCESS |
| Frontend accessible | http://localhost:3000 loads | SUCCESS |
| Total commands | 8 distinct commands | PASS (<= 10) |
