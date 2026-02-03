# Quickstart: kubectl-ai and Kagent Setup

**Feature**: 009-kubectl-ai-kagent
**Date**: 2026-02-03

## Prerequisites

| Tool | Verify Command | Install (if missing) |
|------|----------------|---------------------|
| kubectl | `kubectl version --client` | Included with Docker Desktop |
| Minikube | `minikube status` | `winget install Kubernetes.minikube` |
| Helm | `helm version` | `winget install Helm.Helm` |
| Git Bash | Required for Windows | [git-scm.com](https://git-scm.com/) |
| Gemini API Key | - | [Google AI Studio](https://aistudio.google.com/) |

## Part 1: kubectl-ai Setup

### Step 1: Install kubectl-ai

```bash
# Windows (Git Bash) - download binary directly
mkdir -p ~/.local/bin
curl -sLO "https://github.com/GoogleCloudPlatform/kubectl-ai/releases/latest/download/kubectl-ai_Windows_x86_64.zip"
unzip kubectl-ai_Windows_x86_64.zip -d ~/.local/bin
rm kubectl-ai_Windows_x86_64.zip
export PATH="$HOME/.local/bin:$PATH"

# Verify installation
kubectl-ai version
```

### Step 2: Configure API Key

```bash
# Option A: OpenAI API key (recommended - works with --llm-provider=openai)
export OPENAI_API_KEY="your-openai-key-here"

# Option B: Gemini API key (free tier available)
# Get from https://aistudio.google.com/
export GEMINI_API_KEY="your-gemini-key-here"

# Add to shell profile for persistence
echo 'export OPENAI_API_KEY="your-key"' >> ~/.bashrc
```

### Step 3: Verify Connection

```bash
# Ensure Minikube is running
minikube status

# Test kubectl-ai
kubectl ai "list all pods in the default namespace"
```

## Part 2: Kagent Setup

### Step 1: Install Kagent CLI

```bash
# Windows (Git Bash) - download binary directly
curl -sL "https://github.com/kagent-dev/kagent/releases/latest/download/kagent-windows-amd64.exe" -o ~/.local/bin/kagent.exe

# Verify installation
kagent version
```

### Step 2: Deploy Kagent to Cluster

```bash
# Install with minimal profile (recommended for local dev)
kagent install --profile minimal

# Verify Kagent pods are running
kubectl get pods -n kagent
```

### Step 3: Configure API Key for Kagent

```bash
# Set OpenAI or Gemini key (Kagent uses this for AI operations)
export OPENAI_API_KEY="your-openai-key"
# OR
export GEMINI_API_KEY="your-gemini-key"
```

### Step 4: Access Kagent Dashboard

```bash
# Open the web dashboard
kagent dashboard

# This sets up port-forward and opens browser
```

## Usage Examples

### kubectl-ai Commands

```bash
# Scale deployments (use --quiet --skip-permissions for non-interactive mode)
kubectl-ai --llm-provider=openai --quiet --skip-permissions "scale the todo-backend deployment to 3 replicas"
kubectl-ai --llm-provider=openai --quiet --skip-permissions "scale the todo-frontend deployment to 3 replicas"

# Health checks
kubectl-ai --llm-provider=openai --quiet --skip-permissions "check the health of all pods in the default namespace"
kubectl-ai --llm-provider=openai --quiet --skip-permissions "show me any pods with errors or restarts"

# Resource analysis
kubectl-ai --llm-provider=openai --quiet --skip-permissions "check the resource allocation of the cluster"
kubectl-ai --llm-provider=openai --quiet --skip-permissions "which pods are using the most CPU?"
```

### Kagent Commands

```bash
# Open dashboard for visual analysis
kagent dashboard

# From the dashboard:
# - Select "Kubernetes Agent"
# - Ask: "analyze the cluster health"
# - Ask: "suggest resource optimizations"
```

## Standard kubectl Fallbacks

If AI tools are unavailable, use these standard kubectl commands:

| AI Command | kubectl Fallback |
|------------|------------------|
| Scale to 3 replicas | `kubectl scale deployment todo-backend --replicas=3` |
| Check pod health | `kubectl get pods -o wide` |
| Show pod errors | `kubectl get pods --field-selector=status.phase!=Running` |
| Resource usage | `kubectl top pods` (requires metrics-server) |
| Cluster events | `kubectl get events --sort-by=.lastTimestamp` |

## Troubleshooting

### kubectl-ai not found

```bash
# Add to PATH
export PATH="$HOME/.local/bin:$PATH"
# Or reinstall
curl -sSL https://raw.githubusercontent.com/GoogleCloudPlatform/kubectl-ai/main/install.sh | bash
```

### API key errors

```bash
# Verify key is set
echo $GEMINI_API_KEY

# Re-export if needed
export GEMINI_API_KEY="your-key"
```

### Kagent pods not starting

```bash
# Check pod status
kubectl get pods -n kagent -o wide

# Check logs
kubectl logs -n kagent -l app=kagent

# Reinstall if needed
kagent uninstall && kagent install --profile minimal
```

### Minikube connection issues

```bash
# Ensure cluster is running
minikube status

# Restart if needed
minikube stop && minikube start --driver=docker

# Verify context
kubectl config current-context  # Should show "minikube"
```

## Validation Checklist

| Step | Command | Expected Result |
|------|---------|-----------------|
| kubectl-ai installed | `kubectl-ai --version` | Version number displayed |
| API key configured | `echo $GEMINI_API_KEY` | Key value (not empty) |
| kubectl-ai works | `kubectl ai "list pods"` | Pod list returned |
| Kagent installed | `kagent --version` | Version number displayed |
| Kagent deployed | `kubectl get pods -n kagent` | Pods in Running state |
| Kagent dashboard | `kagent dashboard` | Browser opens |
