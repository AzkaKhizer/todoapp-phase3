# Research: kubectl-ai and Kagent Installation

**Feature**: 009-kubectl-ai-kagent
**Date**: 2026-02-03

## Research Questions

1. How to install kubectl-ai on Windows?
2. What API keys are required for kubectl-ai?
3. How to install Kagent on Minikube?
4. What are the system requirements?

## Findings

### Decision 1: kubectl-ai Installation Method

**Decision**: Use the curl installer (cross-platform) or Krew plugin manager

**Rationale**:
- curl installer is the quickest method and works across platforms
- Krew provides better integration as a kubectl plugin
- Both methods are officially supported by GoogleCloudPlatform

**Alternatives Considered**:
- Homebrew (macOS only - not applicable for Windows)
- Manual binary download (more complex, less maintainable)
- NixOS (not applicable for Windows)

**Installation Commands**:
```bash
# Option 1: Quick install (recommended)
curl -sSL https://raw.githubusercontent.com/GoogleCloudPlatform/kubectl-ai/main/install.sh | bash

# Option 2: Using Krew (if already installed)
kubectl krew index add kubectl-ai https://github.com/sozercan/kubectl-ai
kubectl krew install kubectl-ai/kubectl-ai

# Option 3: Manual for Windows (Git Bash)
# Download from https://github.com/GoogleCloudPlatform/kubectl-ai/releases
# Extract and add to PATH
```

**Sources**:
- [GoogleCloudPlatform/kubectl-ai GitHub](https://github.com/GoogleCloudPlatform/kubectl-ai)
- [sozercan/kubectl-ai GitHub](https://github.com/sozercan/kubectl-ai)

---

### Decision 2: kubectl-ai API Provider

**Decision**: Use Gemini API (default, free tier available)

**Rationale**:
- Gemini is the default provider for kubectl-ai
- Free tier sufficient for development/testing
- OpenAI is also supported as alternative

**Alternatives Considered**:
- OpenAI (requires paid API key)
- Grok (requires xAI API key)
- Ollama local LLM (requires local setup, slower)

**Configuration**:
```bash
# Gemini (default)
export GEMINI_API_KEY=your_api_key_here
kubectl ai

# OpenAI alternative
export OPENAI_API_KEY=your_api_key_here
kubectl-ai --llm-provider=openai --model=gpt-4o

# Grok alternative
export GROK_API_KEY=your_xai_api_key_here
kubectl-ai --llm-provider=grok --model=grok-3-beta
```

**Sources**:
- [Google AI Studio](https://aistudio.google.com/) - Get Gemini API key

---

### Decision 3: Kagent Installation Method

**Decision**: Use the install script with minimal profile

**Rationale**:
- Install script is the simplest method
- Minimal profile avoids unnecessary agents
- Works with existing Minikube cluster

**Alternatives Considered**:
- Helm chart (more control but more complex)
- Demo profile (includes pre-loaded agents we may not need)

**Installation Commands**:
```bash
# 1. Install Kagent CLI
curl https://raw.githubusercontent.com/kagent-dev/kagent/refs/heads/main/scripts/get-kagent | bash

# 2. Install to cluster (minimal profile)
kagent install --profile minimal

# 3. Open dashboard
kagent dashboard
```

**Sources**:
- [Kagent Official Site](https://kagent.dev/)
- [Kagent GitHub](https://github.com/kagent-dev/kagent)
- [Kagent Quickstart](https://kagent.dev/docs/kagent/getting-started/quickstart)

---

### Decision 4: API Key Requirements

**Decision**: Document both Gemini (free) and OpenAI (paid) options

**Rationale**:
- Users may already have OpenAI keys
- Gemini free tier is sufficient for local development
- Both tools support multiple providers

**Summary Table**:

| Tool | Provider | Free Tier | API Key Source |
|------|----------|-----------|----------------|
| kubectl-ai | Gemini | Yes | [Google AI Studio](https://aistudio.google.com/) |
| kubectl-ai | OpenAI | No | [OpenAI Platform](https://platform.openai.com/) |
| Kagent | OpenAI | No | [OpenAI Platform](https://platform.openai.com/) |
| Kagent | Gemini | Yes | [Google AI Studio](https://aistudio.google.com/) |

---

## System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| kubectl | v1.25+ | v1.31+ |
| Kubernetes cluster | Minikube/Kind | Any K8s v1.25+ |
| API Key | One of: Gemini, OpenAI | Gemini (free tier) |
| Git Bash | Required on Windows | - |
| Docker | Running | - |

## Compatibility Notes

- **Windows**: Both tools work via Git Bash or WSL2
- **API Keys**: Environment variables must be set before running commands
- **Minikube**: Ensure cluster is running (`minikube status`)
- **kubectl context**: Must be set to Minikube (`kubectl config current-context`)
