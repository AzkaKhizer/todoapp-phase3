# Helm Values Schema: todo-frontend

**Chart**: `helm/todo-frontend`
**Spec Refs**: FR-002, FR-004, FR-005, FR-006, FR-007

## values.yaml Structure

```yaml
# Image configuration (FR-002)
image:
  repository: todo-frontend    # Docker image name
  tag: latest                  # Image tag
  pullPolicy: Never            # Never pull from registry (local Minikube)

# Replica configuration (FR-005)
replicaCount: 1                # Default: 1, scalable to 3

# Service configuration (FR-004)
service:
  type: NodePort               # Exposed via Minikube IP
  port: 3000                   # Service port

# Container port
containerPort: 3000

# Health probes (FR-007)
livenessProbe:
  tcpSocket:
    port: 3000
  initialDelaySeconds: 20
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /
    port: 3000
  initialDelaySeconds: 10
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
  NEXT_PUBLIC_API_URL: "http://todo-backend:8000/api"
  NEXT_PUBLIC_BETTER_AUTH_URL: "http://todo-frontend:3000"

# Environment variables - sensitive (FR-006)
# Override via --set or values-secret.yaml (gitignored)
secrets:
  DATABASE_URL: ""             # Required: Neon PostgreSQL connection string
  BETTER_AUTH_SECRET: ""       # Required: Must match backend

# Ingress configuration (optional, FR-011)
ingress:
  enabled: false
  className: nginx
  paths:
    - path: /
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
| `secrets.BETTER_AUTH_SECRET` | string | Yes | Non-empty, must match backend |

## Important Notes

- `NEXT_PUBLIC_*` variables are baked into the Next.js build at build time, not runtime. For Kubernetes, these must be set as build args in the Dockerfile OR the frontend must use runtime configuration.
- The `DATABASE_URL` for the frontend uses the standard `postgresql://` protocol (not `postgresql+asyncpg://` like the backend) because Better Auth uses the `pg` npm package directly.
