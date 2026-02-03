# Helm Values Schema: todo-backend

**Chart**: `helm/todo-backend`
**Spec Refs**: FR-001, FR-003, FR-005, FR-006, FR-007

## values.yaml Structure

```yaml
# Image configuration (FR-001)
image:
  repository: todo-backend     # Docker image name
  tag: latest                  # Image tag
  pullPolicy: Never            # Never pull from registry (local Minikube)

# Replica configuration (FR-005)
replicaCount: 1                # Default: 1, scalable to 3

# Service configuration (FR-003)
service:
  type: ClusterIP              # Internal-only service
  port: 8000                   # Service port

# Container port
containerPort: 8000

# Health probes (FR-007)
livenessProbe:
  tcpSocket:
    port: 8000
  initialDelaySeconds: 15
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /api/health
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 5

# Resource limits
resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 256Mi

# Environment variables - non-sensitive (FR-006)
config:
  CORS_ORIGINS: "*"
  BETTER_AUTH_URL: "http://todo-frontend:3000"
  PORT: "8000"

# Environment variables - sensitive (FR-006)
# Override via --set or values-secret.yaml (gitignored)
secrets:
  DATABASE_URL: ""             # Required: Neon PostgreSQL connection string
  BETTER_AUTH_SECRET: ""       # Required: Must match frontend
  OPENAI_API_KEY: ""           # Required: OpenAI API key

# Ingress configuration (optional, FR-011)
ingress:
  enabled: false
  className: nginx
  paths:
    - path: /api
      pathType: Prefix
```

## Validation Rules

| Field | Type | Required | Constraint |
|-------|------|----------|------------|
| `image.repository` | string | Yes | Must be a valid Docker image name |
| `image.tag` | string | Yes | Non-empty |
| `replicaCount` | integer | Yes | 1-3 |
| `service.port` | integer | Yes | 1-65535 |
| `secrets.DATABASE_URL` | string | Yes | Must start with `postgresql` |
| `secrets.BETTER_AUTH_SECRET` | string | Yes | Non-empty, must match frontend |
| `secrets.OPENAI_API_KEY` | string | Yes | Must start with `sk-` |
