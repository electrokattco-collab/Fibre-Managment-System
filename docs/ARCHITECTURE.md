# FibreForge Architecture

## Overview

Three-tier architecture:

```
┌─────────────────┐
│   React SPA     │  ← Client tier
│   (Frontend)    │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  Express API    │  ← Application tier
│   (Backend)     │
└────────┬────────┘
         │ SQL
         ▼
┌─────────────────┐
│   PostgreSQL    │  ← Data tier
│   (Database)    │
└─────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 18 | Component-based UI |
| Build Tool | Vite | Fast dev, optimized builds |
| Styling | Tailwind CSS | Utility-first styling |
| State (Server) | React Query | Data fetching, caching |
| State (Client) | Zustand | UI state, auth state |
| Routing | React Router v6 | SPA navigation |
| Backend | Node.js + Express | REST API |
| Database | PostgreSQL | Relational data |
| ORM | Prisma | Type-safe database |
| Auth | JWT | Stateless authentication |

---

## Frontend Architecture

### Component Structure

```
src/components/
├── layout/           # Page structure
│   ├── Layout.jsx
│   ├── Sidebar.jsx
│   ├── TopNav.jsx
│   └── MobileNav.jsx
├── ui/               # Reusable UI primitives
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Badge.jsx
│   ├── Table.jsx
│   └── Input.jsx
└── domain/           # Business-specific
    ├── CustomerCard.jsx
    ├── FieldTaskCard.jsx
    └── TrialProgress.jsx
```

### State Management

**Server State (React Query):**
```javascript
const { data: customers } = useQuery({
  queryKey: ['customers', filters],
  queryFn: () => api.customers.list(filters)
});
```

**Client State (Zustand):**
```javascript
const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null })
}));
```

---

## Backend Architecture

### Project Structure

```
api/
├── server.js
├── middleware/
│   ├── auth.js
│   ├── error.js
│   └── upload.js
├── routes/
│   ├── customers.js
│   ├── trials.js
│   ├── preOrders.js
│   └── fieldTasks.js
├── controllers/
│   └── customerController.js
└── services/
    └── customerService.js
```

### API Design

**RESTful Resources:**
```
GET    /api/customers          # List
POST   /api/customers          # Create
GET    /api/customers/:id      # Get one
PUT    /api/customers/:id      # Update
DELETE /api/customers/:id      # Delete
```

**Response Format:**
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 150 }
}
```

---

## Database Schema

### Core Entities

- **Address** — Central location entity
- **Customer** — Customer with support for incomplete data
- **Trial** — Trial lifecycle tracking
- **PreOrder** — Installation queue
- **FieldTask** — Technician work queue
- **Connection** — Technical connection details
- **Interaction** — Activity history

### Key Relationships

```
Address 1--* Customer
Customer 1--* Trial
Customer 1--* PreOrder
PreOrder 1--1 FieldTask
```

---

## Security

### Authentication
- JWT tokens (access + refresh)
- bcrypt password hashing (12 rounds)
- Rate limiting (100 req/15min)

### Authorization
- Role-based access control (RBAC)
- Middleware for route protection

### Data Protection
- Input validation (Zod)
- SQL injection prevention (Prisma)
- XSS protection (input sanitization)

---

## Deployment

**Recommended Stack:**
- **Frontend:** Vercel
- **Backend:** Railway/Render
- **Database:** Supabase/Railway
- **Storage:** Cloudflare R2

See [DEPLOYMENT.md](DEPLOYMENT.md) for details.
