# Quickstart: Local Kubernetes Deployment

**Feature**: 007-local-k8s-deployment
**Date**: 2026-02-02

## Prerequisites

- Docker Desktop (or Docker Engine) installed and running
- Minikube installed (`winget install minikube` on Windows)
- Helm installed (`winget install Helm.Helm` on Windows)
- kubectl installed (bundled with Docker Desktop or `winget install Kubernetes.kubectl`)
- Neon PostgreSQL database URL (from existing deployment)
- BETTER_AUTH_SECRET (from existing `.env` files)
- OPENAI_API_KEY (from existing `.env` files)

### Optional Tools

- kubectl-ai: `brew install kubectl-ai` or see [kubectl-ai docs](https://github.com/sozercan/kubectl-ai)
- Kagent: See [Kagent docs](https://github.com/kagent-dev/kagent)
- Docker AI (Gordon): Requires Docker Desktop 4.53+ with AI features enabled

## Step-by-Step Deployment

### 1. Start Minikube

```bash
minikube start --driver=docker --memory=4096 --cpus=2
minikube addons enable ingress
```

### 2. Build Docker Images

```bash
# Build backend image
docker build -t todo-backend:latest ./backend

# Build frontend image
docker build -t todo-frontend:latest ./frontend
```

### 3. Load Images into Minikube

```bash
minikube image load todo-backend:latest
minikube image load todo-frontend:latest
```

### 4. Create Secrets

```bash
# Option A: From command line
kubectl create secret generic todo-secrets \
  --from-literal=DATABASE_URL="your-neon-connection-string" \
  --from-literal=BETTER_AUTH_SECRET="your-64-char-hex-secret" \
  --from-literal=OPENAI_API_KEY="your-openai-api-key"

# Option B: Using Helm --set (secrets in values override)
# Secrets will be created by Helm chart templates
```

### 5. Deploy with Helm

```bash
# Deploy backend
helm install todo-backend ./helm/todo-backend \
  --set secrets.DATABASE_URL="your-neon-connection-string" \
  --set secrets.BETTER_AUTH_SECRET="your-64-char-hex-secret" \
  --set secrets.OPENAI_API_KEY="your-openai-api-key"

# Deploy frontend
helm install todo-frontend ./helm/todo-frontend \
  --set secrets.DATABASE_URL="your-neon-connection-string" \
  --set secrets.BETTER_AUTH_SECRET="your-64-char-hex-secret"
```

### 6. Verify Deployment

```bash
# Check pod status
kubectl get pods

# Check services
kubectl get services

# Get Minikube IP
minikube ip

# Access frontend via NodePort
minikube service todo-frontend --url
```

### 7. Access the Application

Open the URL from `minikube service todo-frontend --url` in your browser. The Todo Chatbot should be fully functional.

## Common Operations

### Scaling

```bash
# Scale backend to 3 replicas
kubectl scale deployment todo-backend --replicas=3

# Or via Helm upgrade
helm upgrade todo-backend ./helm/todo-backend --set replicaCount=3

# With kubectl-ai (optional)
kubectl-ai "scale the backend to 3 replicas"
```

### Updating Configuration

```bash
# Update environment variables
helm upgrade todo-backend ./helm/todo-backend \
  --set config.CORS_ORIGINS="http://new-frontend-url"

# Update image after rebuild
docker build -t todo-backend:v2 ./backend
minikube image load todo-backend:v2
helm upgrade todo-backend ./helm/todo-backend --set image.tag=v2
```

### Checking Logs

```bash
# View backend logs
kubectl logs -l app=todo-backend --tail=100

# View frontend logs
kubectl logs -l app=todo-frontend --tail=100

# With kubectl-ai (optional)
kubectl-ai "show me the latest backend logs"
```

### Cluster Health (with Kagent)

```bash
# Check cluster health
kagent "analyze the cluster health"

# Check resource utilization
kagent "show resource usage for todo namespace"
```

### Teardown

```bash
helm uninstall todo-frontend
helm uninstall todo-backend
kubectl delete secret todo-secrets
minikube stop
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Pods stuck in `ImagePullBackOff` | Ensure `imagePullPolicy: Never` in values.yaml; images loaded via `minikube image load` |
| Backend can't reach Neon DB | Check DNS resolution: `kubectl exec <pod> -- nslookup <neon-host>`; verify no proxy/firewall blocking |
| Frontend shows connection error | Verify `NEXT_PUBLIC_API_URL` points to `http://todo-backend:8000/api` |
| Ingress not working | Ensure `minikube addons enable ingress` was run; check `kubectl get ingress` |
| Pods in CrashLoopBackOff | Check logs: `kubectl logs <pod-name>`; likely missing env vars or secrets |
