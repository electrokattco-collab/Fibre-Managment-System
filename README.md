# FibreForge

[![Live Demo](https://img.shields.io/badge/demo-offline-lightgrey)](https://github.com/electrokattco-collab/Fibre-Managment-System)
[![React](https://img.shields.io/badge/react-18-61DAFB?logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **End-to-end FTTH operations platform for fiber network providers.**  
> Streamline customer acquisition, trial management, and field operations from coverage mapping to active subscription.

[📸 Screenshots](#screenshots) • [📖 Documentation](docs/) • [🚀 Getting Started](#getting-started) • [📋 Roadmap](docs/ROADMAP.md)

---

## About the Project

FibreForge is a full-stack internal operations platform designed for fiber ISPs, municipal utilities, and network operators managing FTTH (Fiber to the Home) deployments. It unifies the customer lifecycle across multiple teams, replacing fragmented spreadsheets and paper-based workflows with a single source of truth.

The platform handles real-world data imperfections — customers without names, addresses as primary identifiers, and incomplete contact information — while providing clear operational visibility to every stakeholder.

### Problem Statement

Fiber network operators face critical operational challenges:

- **Fragmented Tools:** Sales uses spreadsheets, field teams use paper forms, customer data lives in silos
- **Trial Drop-offs:** No systematic tracking of trial expiration or follow-up
- **Coverage Gaps:** Difficulty identifying which addresses are serviceable but not connected
- **Field Inefficiency:** Technicians lack mobile-optimized work queues and real-time updates
- **Data Quality:** Real-world customer data is messy — missing names, partial addresses, multiple phone numbers

### Solution

FibreForge provides **role-based operational views** that adapt to how each team actually works:

- **Executives** see conversion metrics and network health at a glance
- **Sales teams** manage leads by address with coverage-aware eligibility
- **Call center agents** access complete customer context during support calls
- **Field technicians** use mobile-optimized task queues with offline capability
- **Operations staff** bulk-import data and automate workflow triggers

---

## Key Features

### 📊 Executive Dashboard
- Real-time KPIs: Trial conversion rates, coverage penetration, installation backlog
- Network health indicators with status alerts
- CSV data administration for bulk operations
- Activity audit trail

### 👥 Customer Management
- Address-first customer directory (handles incomplete data gracefully)
- Advanced search: name, address, account ID, phone number
- Status-based filtering: Active, Suspended, Pending Install
- Complete customer profile with connection details and billing overview

### 🔄 Trial Management
- Trial lifecycle tracking: Active → Pending Expiry → Expired
- Automated follow-up queue for expiring trials
- Call center integration markers (ViciDial, WhatsApp Business)
- Conversion analytics

### 📍 Coverage & Unconnected Leads
- Address-level coverage mapping
- Pre-trial zone identification for demand aggregation
- Lead scoring based on proximity to existing infrastructure
- Export tools for field sales teams

### 📦 Pre-Order Logistics
- Installation scheduling and technician dispatch
- Queue management with priority handling
- Handover workflow from installation to active trial
- Materials and infrastructure tracking

### 🛠️ Field Operations
- Mobile-optimized technician work queue
- Job status tracking: Pending → Assigned → Installing → Complete
- Progress indicators and time tracking
- Photo documentation and signature capture
- Offline-first architecture for field use

---

## User Roles

| Role | Primary Screens | Key Actions |
|------|----------------|-------------|
| **Executive / Admin** | Dashboard, Reports | View KPIs, bulk data import, system configuration |
| **Sales Representative** | Unconnected, Trials, Pre-orders | Lead qualification, trial enrollment, follow-up calls |
| **Call Center Agent** | Customers, Trials | Customer lookup, support ticket creation, trial extension |
| **Field Technician** | Field Operations | Job acceptance, installation updates, photo upload |
| **Operations Manager** | All screens | Queue management, technician dispatch, coverage updates |

---

## System Screens

| Screen | Purpose | Primary User |
|--------|---------|--------------|
| **Dashboard** | Executive overview and data administration | Admin, Executive |
| **Customers** | Full customer directory and detail view | Call Center, Sales |
| **Trials** | Trial lifecycle management and follow-up | Sales, Operations |
| **Pre-Orders** | Installation queue and logistics | Operations, Field Manager |
| **Unconnected** | Lead discovery and coverage mapping | Sales, Marketing |
| **Field Operations** | Technician mobile work queue | Field Technician |
| **Coverage Map** | Geographic view of network and opportunities | Planning, Sales |

---

## Tech Stack

### Frontend
- **React 18** — Component-based UI with hooks
- **Vite** — Fast development and optimized builds
- **Tailwind CSS** — Utility-first styling with custom design tokens
- **React Query** — Server state management and caching
- **Zustand** — Client state management
- **React Router v6** — SPA navigation
- **Recharts** — Data visualization

### Backend
- **Node.js** + **Express** — REST API server
- **PostgreSQL** — Relational database
- **Prisma** — Type-safe ORM and migrations
- **JWT** — Authentication
- **Multer** — File uploads (CSV imports)

### DevOps & Tools
- **Docker** — Containerization
- **GitHub Actions** — CI/CD pipeline
- **Vitest** — Unit testing
- **Cypress** — E2E testing
- **ESLint + Prettier** — Code quality

---

## Project Structure

```
fibre-forge/
├── README.md
├── LICENSE
├── package.json
├── vite.config.js
├── tailwind.config.js
├── docker-compose.yml
├── .env.example
├── .github/
│   └── workflows/
│       └── deploy.yml
├── docs/
│   ├── PRODUCT_OVERVIEW.md
│   ├── ARCHITECTURE.md
│   ├── API_OVERVIEW.md
│   ├── DEPLOYMENT.md
│   └── ROADMAP.md
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── api/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── utils/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   └── domain/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   └── utils/
└── public/
    └── assets/
```

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher (or Docker)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/electrokattco-collab/Fibre-Managment-System.git
cd Fibre-Managment-System

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your database connection in .env
# DATABASE_URL="postgresql://user:password@localhost:5432/fibreforge"

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
npx prisma db seed

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

---

## Screenshots

*Screenshots will be added here once the UI refactor is complete.*

| Dashboard | Customer Directory | Field Operations |
|-----------|-------------------|------------------|
| ![Dashboard](docs/assets/dashboard.png) | ![Customers](docs/assets/customers.png) | ![Field Ops](docs/assets/field-ops.png) |

---

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for detailed development phases.

### Current Phase: Foundation (In Progress)
- [x] Project documentation
- [ ] React + Vite setup
- [ ] Design system implementation
- [ ] Layout components

### Upcoming Phases
- **Phase 2:** Core UI — Page components, routing, state management
- **Phase 3:** Data Layer — Backend API, database, authentication
- **Phase 4:** Features — CSV import, search, filtering
- **Phase 5:** Polish — Testing, performance, deployment

---

## API Documentation

See [docs/API_OVERVIEW.md](docs/API_OVERVIEW.md) for complete API reference.

---

## License

[MIT](LICENSE) © 2026

---

## Author

**Senior Full-Stack Engineer**

This project demonstrates expertise in:
- React ecosystem and modern frontend architecture
- RESTful API design and implementation
- Database modeling and ORM usage
- UI/UX design for complex operational interfaces
- DevOps and deployment automation
