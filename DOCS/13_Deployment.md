# 13. Deployment, Infrastructure & CI/CD Pipeline

## 1. Cloud Infrastructure Architecture

NEXORA utilizes a distributed multi-cloud deployment topology:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLOUD INFRASTRUCTURE                                 │
├───────────────────────────────┬──────────────────────────────┬─────────────────────────┤
│ FRONTEND SPA (Vercel Edge)    │ BACKEND API (Render Cloud)   │ DATA & AUTH (Supabase)  │
│ • Vercel Global Edge Network  │ • Render Linux Web Service   │ • Supabase Postgres 15  │
│ • Automatic GitHub CI/CD      │ • Node.js v18 LTS Runtime    │ • Supabase Auth Engine  │
│ • Single Page Rewrite Rule    │ • Gzip Response Compression  │ • Row Level Security    │
│ • `client/vercel.json`        │ • Auto-restart policy        │ • Automated DB Backups  │
└───────────────────────────────┴──────────────────────────────┴─────────────────────────┘
```

---

## 2. Platform Platform Configurations & Environments

### A. Frontend Deployment on Vercel
- **Root Directory:** `client/`
- **Build Command:** `npm run build` (invokes `vite build`)
- **Output Directory:** `dist`
- **SPA Routing Rewrite (`client/vercel.json`):**
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
- **Required Production Environment Variables:**
  - `VITE_SUPABASE_URL`: Supabase project HTTPS URL.
  - `VITE_SUPABASE_ANON_KEY`: Public anonymous API key.
  - `VITE_API_BASE_URL`: Deployed backend REST API URL (e.g. `https://nexora-api.onrender.com/api/v1`).

### B. Backend Deployment on Render
- **Root Directory:** `server/`
- **Environment:** Node.js Web Service
- **Build Command:** `npm install`
- **Start Command:** `node src/server.js`
- **Required Production Environment Variables:**
  - `PORT`: Automatically assigned by Render (or `5000`).
  - `NODE_ENV`: `production`.
  - `SUPABASE_URL`: Supabase project URL.
  - `SUPABASE_SERVICE_ROLE_KEY`: Secret service role key bypassing RLS.
  - `JWT_SECRET`: Secret key for token verification.
  - `RESEND_API_KEY`: Resend transactional email API key.
  - `CLIENT_URL`: Allowed frontend origin for CORS (e.g. `https://nexora.vercel.app`).

---

## 3. Containerization Specification (Docker & Docker Compose)

NEXORA provides full Docker containerization for local orchestration and staging environments:

### 1. Frontend Dockerfile (`client/Dockerfile`)
Multi-stage build compiling static assets with Node.js and serving via Nginx Alpine:
```dockerfile
# Stage 1: Build static bundle
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve via Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Backend Dockerfile (`server/Dockerfile`)
Lightweight production Node container:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

### 3. Orchestration Config (`docker-compose.yml`)
Spins up both services locally on isolated ports:
```yaml
version: '3.8'
services:
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: nexora_backend
    ports:
      - "5000:5000"
    env_file:
      - ./server/.env
    restart: unless-stopped

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: nexora_frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

---

## 4. Continuous Integration & Workflows (`.github/workflows/`)

NEXORA enforces automated build and quality checks via GitHub Actions workflows:

1. **`build.yml`:** Triggered on pull requests and pushes to `main`. Installs dependencies and runs Vite production build (`npm run build`) in `client/` and syntax check in `server/`.
2. **`lint.yml`:** Executes ESLint checks across both frontend and backend codebases (`npx eslint .`).
3. **`security.yml`:** Runs NPM Audit (`npm audit`) scanning for vulnerable node dependencies.
