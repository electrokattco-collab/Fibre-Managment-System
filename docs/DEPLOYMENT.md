# FibreForge Deployment Guide

## Recommended Stack

| Component | Service | Cost |
|-----------|---------|------|
| Frontend | Vercel | Free |
| Backend | Railway | Free |
| Database | Supabase | Free |
| Storage | Cloudflare R2 | Free |

---

## Environment Variables

Create `.env.production`:

```env
DATABASE_URL="postgresql://user:password@host:5432/fibreforge"
JWT_SECRET="your-super-secret-key-min-32-chars"
CORS_ORIGIN="https://fibreforge.vercel.app"
API_URL="https://fibreforge-api.railway.app"
```

---

## Deployment Steps

### 1. Database (Supabase)

1. Create project at supabase.com
2. Get connection string from Settings > Database
3. Save for later

### 2. Backend (Railway)

1. Connect GitHub repo
2. Add PostgreSQL database (or use Supabase)
3. Set environment variables
4. Deploy

**railway.yaml:**
```yaml
build:
  builder: NIXPACKS
deploy:
  startCommand: "npm start"
```

### 3. Frontend (Vercel)

1. Import GitHub repo
2. Set framework preset to Vite
3. Add environment variable: `VITE_API_URL`
4. Deploy

**vercel.json:**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Database Migrations

```bash
# Production
npx prisma migrate deploy

# Seed
npx prisma db seed
```

---

## Docker (Alternative)

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: fibreforge
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: fibreforge
    volumes:
      - postgres_data:/var/lib/postgresql/data
  api:
    build: ./api
    environment:
      DATABASE_URL: postgresql://fibreforge:${DB_PASSWORD}@db:5432/fibreforge
    ports:
      - "3001:3001"
    depends_on:
      - db
  web:
    build: .
    ports:
      - "80:80"
    depends_on:
      - api
volumes:
  postgres_data:
```

---

## CI/CD (GitHub Actions)

**.github/workflows/deploy.yml:**
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - run: npm run build
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] API health check returns 200
- [ ] Authentication works
- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
