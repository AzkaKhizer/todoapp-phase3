# Research: Local Kubernetes Deployment

**Feature**: 007-local-k8s-deployment
**Date**: 2026-02-02

## Research Tasks

### R1: Backend Dockerfile Adaptation

**Context**: Existing Dockerfile targets Hugging Face Spaces (port 7860). Needs adaptation for Kubernetes.

**Decision**: Adapt the existing Dockerfile minimally. Change `EXPOSE 7860` to `EXPOSE 8000` (standard FastAPI port). The `main.py` already reads `PORT` from environment (`os.environ.get("PORT", 8000)`), so the container will use whatever port is configured via Kubernetes.

**Rationale**: The existing Dockerfile is functional. The only Hugging Face-specific element is the EXPOSE directive. The entrypoint (`python main.py`) and the PORT env var pattern are already cloud-agnostic.

**Alternatives Considered**:
- Gunicorn with uvicorn workers: Adds complexity; uvicorn alone is sufficient for local development and small-scale deployment. Can be added later for production.
- Poetry/UV in-container install: Adds build complexity; `pip install -r requirements.txt` is simpler and the existing pattern.

### R2: Frontend Dockerfile Design

**Context**: No frontend Dockerfile exists. Next.js 15 with App Router needs containerization.

**Decision**: Multi-stage Dockerfile using `node:18-alpine`:
1. **Stage 1 (deps)**: Install node_modules
2. **Stage 2 (builder)**: Copy source, run `npm run build` with `output: 'standalone'` in next.config
3. **Stage 3 (runner)**: Copy standalone output, static assets, public files. Run with `node server.js`.

**Rationale**: Next.js standalone output produces a minimal server that includes only required dependencies (~50MB vs ~500MB for full node_modules). Multi-stage build keeps the final image small.

**Alternatives Considered**:
- Single-stage build: Larger image (~800MB+), includes dev dependencies and source code.
- nginx serving static export: Would lose SSR capabilities and API routes (Better Auth uses Next.js API routes).
- Bun runtime: Not well-tested with Next.js 15 App Router; Node 18 is the safe choice.

**Important Note**: The frontend `next.config.ts` needs `output: 'standalone'` added for the Docker build. This is the only application code change required.

### R3: Helm Chart Structure

**Context**: No existing Helm charts. Need charts for both services.

**Decision**: One Helm chart per service under `helm/` directory at project root. Each chart contains:
- `Chart.yaml`: Chart metadata
- `values.yaml`: Configurable defaults (image, replicas, ports, env vars)
- `templates/deployment.yaml`: Pod spec with health probes
- `templates/service.yaml`: ClusterIP (backend) or NodePort (frontend)
- `templates/configmap.yaml`: Non-sensitive environment variables
- `templates/secret.yaml`: Sensitive credentials (optional, can use external secrets)
- `templates/ingress.yaml`: Optional NGINX ingress rules
- `templates/_helpers.tpl`: Template helper functions

**Rationale**: Helm is the specified requirement. One chart per service provides independent lifecycle management (can upgrade backend without touching frontend). The `helm/` directory keeps infrastructure separate from application code.

**Alternatives Considered**:
- Single umbrella chart: Couples deployment lifecycle; harder to manage independently.
- Kustomize: Not specified in requirements; Helm is explicitly required.
- Raw kubectl manifests: Helm provides templating, values overrides, and release management.

### R4: Image Loading into Minikube

**Context**: Docker images built locally need to be available inside Minikube's container runtime.

**Decision**: Use `minikube image load <image>` to transfer locally-built images into Minikube. Set `imagePullPolicy: Never` in Helm values to prevent Kubernetes from trying to pull from a registry.

**Rationale**: This is the simplest approach for local development. No registry setup required. `minikube image load` copies the image directly into Minikube's Docker daemon.

**Alternatives Considered**:
- `eval $(minikube docker-env)`: Builds directly inside Minikube's Docker. Works but means the build happens in Minikube's resource-constrained environment.
- Local registry (localhost:5000): Adds setup complexity; not needed for local development.
- Minikube registry addon: Additional setup; `minikube image load` is simpler.

### R5: Ingress Configuration

**Context**: Need to expose the application via Minikube IP.

**Decision**: Use Minikube's built-in NGINX ingress addon (`minikube addons enable ingress`). Configure path-based routing:
- `/api/*` → backend service (port 8000)
- `/*` → frontend service (port 3000)

Fallback: NodePort services accessible directly via `minikube service <name> --url`.

**Rationale**: NGINX ingress provides a single entry point with path-based routing, matching a production-like setup. NodePort is the simpler fallback if ingress isn't needed.

**Alternatives Considered**:
- LoadBalancer type: Requires `minikube tunnel`; adds complexity.
- Port-forward only: Not persistent; requires terminal session per service.

### R6: Secrets Management in Kubernetes

**Context**: Application needs DATABASE_URL, BETTER_AUTH_SECRET, OPENAI_API_KEY at runtime. These must not be baked into images.

**Decision**: Use Kubernetes Secrets created from a local `.env` file or via `helm install --set` overrides. The Helm chart's `secret.yaml` template will define the Secret resource with base64-encoded values from `values.yaml`. For actual deployment, users provide values via `--set` or a local `values-secret.yaml` (gitignored).

**Rationale**: Kubernetes Secrets are the standard mechanism. Using Helm `--set` or a separate values file keeps secrets out of version control while making deployment repeatable.

**Alternatives Considered**:
- External Secrets Operator: Overkill for local Minikube development.
- Sealed Secrets: Adds complexity; not needed for local dev.
- ConfigMap for everything: Insecure; secrets should use Secret resources.

### R7: Health Check Endpoints

**Context**: Kubernetes needs liveness and readiness probes for pod lifecycle management.

**Decision**:
- **Backend**: HTTP GET `/api/health` (existing or to be added) for readiness; TCP socket on port 8000 for liveness.
- **Frontend**: HTTP GET `/` for readiness (Next.js serves the homepage); TCP socket on port 3000 for liveness.

**Rationale**: HTTP probes verify the application is actually serving requests, not just that the process is running. The backend may need a lightweight `/api/health` endpoint if one doesn't exist.

**Note**: The backend's existing FastAPI app at `app/main.py` should be checked for a health endpoint. If none exists, a simple one should be added as a minimal code change (FR-007).

### R8: kubectl-ai and Kagent Usage

**Context**: AI-assisted Kubernetes operations are specified as P2 requirements.

**Decision**: Document usage patterns rather than integrate them into the deployment pipeline. These are developer productivity tools, not deployment dependencies.

**Rationale**: kubectl-ai and Kagent are external CLI tools that the developer installs separately. They operate on an existing cluster. The deployment must work without them (FR-009, FR-010 specify "instructions" not "integration").

**Alternatives Considered**:
- Deep integration (custom scripts wrapping kubectl-ai): Over-engineering for optional tools.
- Ignoring them: Spec explicitly requires documentation.

### R9: Docker AI Agent (Gordon)

**Context**: Optional AI-assisted Docker operations.

**Decision**: Document how to use Gordon for common operations (building, inspecting, troubleshooting). Provide standard Docker CLI equivalents for every Gordon command.

**Rationale**: Gordon is optional (FR-013). Standard Docker CLI is the baseline. Documentation covers both paths.
