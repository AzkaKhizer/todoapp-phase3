# Demo Video Script

**Feature**: 008-k8s-deploy-polish
**Target Duration**: 85 seconds (under 90s limit)
**Format**: Screen recording with narration

---

## Segment 1: Intro + Prerequisites (0:00 - 0:10)

**Show**: Terminal with project directory open

**Narration**: "This is a full-stack Todo app with AI chat, deployed locally on Kubernetes using Minikube and Helm. Let me show you the deployment in 8 commands."

**Commands**:
```bash
# Show tool versions
docker --version
minikube version
helm version
```

---

## Segment 2: Docker Build + Minikube Start (0:10 - 0:25)

**Show**: Terminal running builds

**Narration**: "First, build the Docker images and start a fresh Minikube cluster."

**Commands**:
```bash
docker build -t todo-backend:latest ./backend
docker build -t todo-frontend:latest ./frontend
minikube start --driver=docker
minikube addons enable ingress
```

> **Tip**: Pre-build images before recording to save time. Show the commands but cut to completion.

---

## Segment 3: Helm Deploy + Pod Ready (0:25 - 0:40)

**Show**: Terminal with Helm install and kubectl output

**Narration**: "Load images into Minikube and deploy with Helm. Both pods reach Ready in under 2 minutes."

**Commands**:
```bash
minikube image load todo-backend:latest
minikube image load todo-frontend:latest
helm upgrade --install todo-backend ./helm/todo-backend --set secrets.DATABASE_URL="..." --set secrets.BETTER_AUTH_SECRET="..." --set secrets.OPENAI_API_KEY="..."
helm upgrade --install todo-frontend ./helm/todo-frontend --set secrets.DATABASE_URL="..." --set secrets.BETTER_AUTH_SECRET="..."
kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=120s
kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=120s
kubectl get pods
```

---

## Segment 4: App Walkthrough - Register, Login, CRUD (0:40 - 1:00)

**Show**: Browser at localhost:3000

**Narration**: "The app is accessible via port-forward. Let me register a user, log in, and demonstrate full CRUD operations."

**Actions**:
1. Open http://localhost:3000
2. Register a new user (email + password)
3. Log in with the new credentials
4. Create a new task: "Demo task for video"
5. Edit the task title
6. Toggle task complete
7. Delete the task

---

## Segment 5: AI Chat Demo (1:00 - 1:10)

**Show**: Chat interface in the app

**Narration**: "The app includes an AI-powered chat assistant that can manage tasks using natural language."

**Actions**:
1. Open the chat panel
2. Type: "Add a task called 'Buy groceries'"
3. Show the task appearing in the list
4. Type: "Mark it as complete"

---

## Segment 6: Scaling Demo (1:10 - 1:20)

**Show**: Terminal with kubectl

**Narration**: "Scaling is straightforward with kubectl. Watch as we scale from 1 to 3 replicas with zero downtime."

**Commands**:
```bash
kubectl scale deployment todo-backend --replicas=3
kubectl get pods -l app=todo-backend -w
# Wait until all 3 show Running
kubectl scale deployment todo-backend --replicas=1
```

---

## Segment 7: Closing (1:20 - 1:25)

**Show**: Terminal with final pod status

**Narration**: "Full-stack Kubernetes deployment in 8 commands. Built with FastAPI, Next.js, and OpenAI — managed with Helm on Minikube."

**Commands**:
```bash
kubectl get pods,svc
```

---

## Recording Tips

- Use a screen recording tool (OBS, ShareX, or Windows Game Bar)
- Set terminal font size to 16+ for readability
- Pre-build images and pre-start Minikube to keep within 90 seconds
- Use `clear` between segments for clean transitions
- Record at 1080p or higher
- Keep browser zoom at 100%
