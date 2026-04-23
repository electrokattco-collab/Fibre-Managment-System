# FibreForge Project Structure

## Complete Directory Tree

```
fibre-forge/
├── README.md                     # Project overview and getting started
├── LICENSE                       # MIT License
├── package.json                  # Root package.json with workspaces
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind with custom design tokens
├── postcss.config.js             # PostCSS configuration
├── eslint.config.js              # ESLint configuration
├── .prettierrc                   # Prettier code formatting
├── .gitignore                    # Git ignore rules
├── .env.example                  # Environment variable template
├── docker-compose.yml            # Local development with Docker
├── Dockerfile                    # Production Docker build
│
├── .github/
│   └── workflows/
│       ├── ci.yml                # CI pipeline (test, lint)
│       └── deploy.yml            # CD pipeline (deploy to production)
│
├── docs/                         # Documentation (already created)
│   ├── PRODUCT_OVERVIEW.md
│   ├── ARCHITECTURE.md
│   ├── API_OVERVIEW.md
│   ├── DEPLOYMENT.md
│   ├── ROADMAP.md
│   └── assets/
│       └── screenshots/          # Application screenshots
│
├── prisma/                       # Database schema and migrations
│   ├── schema.prisma             # Prisma schema definition
│   ├── seed.js                   # Database seed script
│   └── migrations/               # Database migrations
│       └── 20240115_init/
│           └── migration.sql
│
├── api/                          # Backend API
│   ├── package.json              # Backend dependencies
│   ├── server.js                 # Express server entry point
│   ├── config/
│   │   ├── database.js           # Prisma client setup
│   │   └── auth.js               # JWT configuration
│   ├── middleware/
│   │   ├── auth.js               # Authentication middleware
│   │   ├── error.js              # Error handling middleware
│   │   ├── upload.js             # Multer file upload setup
│   │   └── validate.js           # Request validation middleware
│   ├── routes/
│   │   ├── index.js              # Route aggregator
│   │   ├── auth.js               # Authentication routes
│   │   ├── customers.js          # Customer CRUD routes
│   │   ├── trials.js             # Trial management routes
│   │   ├── preOrders.js          # Pre-order routes
│   │   ├── fieldTasks.js         # Field task routes
│   │   ├── dashboard.js          # Dashboard/stats routes
│   │   ├── unconnected.js        # Coverage/lead routes
│   │   └── uploads.js            # CSV import routes
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   ├── trialController.js
│   │   ├── preOrderController.js
│   │   ├── fieldTaskController.js
│   │   ├── dashboardController.js
│   │   └── uploadController.js
│   ├── services/
│   │   ├── customerService.js
│   │   ├── csvImportService.js
│   │   └── notificationService.js
│   └── utils/
│       ├── validators.js
│       ├── formatters.js
│       ├── errors.js
│       └── logger.js
│
├── src/                          # Frontend React application
│   ├── main.jsx                  # React entry point
│   ├── App.jsx                   # Root component with routing
│   ├── index.css                 # Global styles and Tailwind imports
│   │
│   ├── components/               # React components
│   │   ├── layout/               # Layout components
│   │   │   ├── Layout.jsx        # Main layout wrapper
│   │   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   │   ├── TopNav.jsx        # Top navigation bar
│   │   │   ├── MobileNav.jsx     # Mobile bottom navigation
│   │   │   └── PageHeader.jsx    # Page title and actions
│   │   │
│   │   ├── ui/                   # Reusable UI primitives
│   │   │   ├── Button.jsx
│   │   │   ├── ButtonGroup.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── CardHeader.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── SearchInput.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── TableHead.jsx
│   │   │   ├── TableBody.jsx
│   │   │   ├── TableRow.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── ToastContainer.jsx
│   │   │   ├── Tabs.jsx
│   │   │   ├── Tab.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── StatCard.jsx
│   │   │
│   │   └── domain/               # Business-specific components
│   │       ├── CustomerCard.jsx
│   │       ├── CustomerRow.jsx
│   │       ├── CustomerDetail.jsx
│   │       ├── AddressDisplay.jsx
│   │       ├── ConnectionStatus.jsx
│   │       ├── TrialProgress.jsx
│   │       ├── TrialStatusBadge.jsx
│   │       ├── FieldTaskCard.jsx
│   │       ├── FieldTaskList.jsx
│   │       ├── CoverageMap.jsx
│   │       ├── ActivityLog.jsx
│   │       └── NotificationBell.jsx
│   │
│   ├── pages/                    # Page components (routes)
│   │   ├── Dashboard.jsx
│   │   ├── Customers.jsx
│   │   ├── CustomerDetail.jsx
│   │   ├── Trials.jsx
│   │   ├── PreOrders.jsx
│   │   ├── Unconnected.jsx
│   │   ├── FieldOps.jsx
│   │   ├── CoverageMap.jsx
│   │   ├── Login.jsx
│   │   └── NotFound.jsx
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useCustomers.js
│   │   ├── useCustomer.js
│   │   ├── useTrials.js
│   │   ├── usePreOrders.js
│   │   ├── useFieldTasks.js
│   │   ├── useDashboard.js
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   └── useMediaQuery.js
│   │
│   ├── services/                 # API service layer
│   │   ├── api.js                # Axios instance configuration
│   │   ├── auth.js               # Auth API calls
│   │   ├── customers.js          # Customer API calls
│   │   ├── trials.js             # Trial API calls
│   │   ├── preOrders.js          # Pre-order API calls
│   │   ├── fieldTasks.js         # Field task API calls
│   │   ├── dashboard.js          # Dashboard API calls
│   │   └── uploads.js            # Upload API calls
│   │
│   ├── store/                    # State management (Zustand)
│   │   ├── useAuthStore.js
│   │   ├── useUiStore.js
│   │   └── useFilterStore.js
│   │
│   ├── utils/                    # Utility functions
│   │   ├── formatters.js         # Date, currency, phone formatting
│   │   ├── validators.js         # Input validation
│   │   ├── constants.js          # App constants
│   │   ├── helpers.js            # General helpers
│   │   └── mockData.js           # Mock data for development
│   │
│   ├── styles/                   # Styling utilities
│   │   └── tokens.js             # Design tokens (colors, spacing)
│   │
│   └── types/                    # TypeScript types (if using TS)
│       ├── customer.types.js
│       ├── trial.types.js
│       └── api.types.js
│
├── public/                       # Static assets
│   ├── favicon.ico
│   ├── logo.svg
│   └── assets/
│       ├── icons/                # Custom icons
│       └── images/               # Static images
│
├── tests/                        # Test files
│   ├── unit/
│   │   ├── components/
│   │   └── utils/
│   ├── integration/
│   └── e2e/
│       └── cypress/
│           └── e2e/
│               ├── auth.cy.js
│               ├── customers.cy.js
│               └── dashboard.cy.js
│
└── scripts/                      # Utility scripts
    ├── seed.js                   # Database seeding
    └── screenshots.js            # Automated screenshots
```

## Key Directories Explained

### `/api` - Backend

The backend follows the **MVC pattern** with an added service layer:

- **Routes:** Define API endpoints and HTTP methods
- **Controllers:** Handle request/response logic
- **Services:** Contain business logic (reusable across controllers)
- **Middleware:** Cross-cutting concerns (auth, error handling, validation)

### `/src/components` - Frontend Components

Components are organized by purpose:

- **layout:** Structural components that appear on every page
- **ui:** Reusable, generic UI primitives (like a component library)
- **domain:** Business-specific components tied to the fiber operations domain

### `/src/pages` - Route Components

Each page corresponds to a route:
- `/` → Dashboard
- `/customers` → Customers
- `/customers/:id` → CustomerDetail
- `/trials` → Trials
- etc.

Pages compose components and hooks to create full screens.

### `/src/services` - API Layer

Abstracts HTTP calls:
```javascript
// services/customers.js
export const getCustomers = (params) => api.get('/customers', { params });
export const getCustomer = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post('/customers', data);
```

### `/src/store` - State Management

Zustand stores for:
- **Auth:** User session, login/logout
- **UI:** Sidebar state, theme, toasts
- **Filters:** Persistent filter preferences

### `/prisma` - Database

Single source of truth for database schema:
- Schema defined in `schema.prisma`
- Migrations track schema changes
- Seed script populates development data

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `CustomerCard.jsx` |
| Hooks | camelCase with use prefix | `useCustomers.js` |
| Utilities | camelCase | `formatters.js` |
| Constants | SCREAMING_SNAKE_CASE | `API_URL` |
| API routes | camelCase | `customers.js` |
| CSS modules | camelCase.module.css | `styles.module.css` |

## Import Aliases

Vite config includes path aliases:

```javascript
// vite.config.js
export default {
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@services': '/src/services',
      '@store': '/src/store',
      '@utils': '/src/utils',
    },
  },
}
```

Usage:
```javascript
import { Button } from '@components/ui/Button';
import { useCustomers } from '@hooks/useCustomers';
```

## Environment-Specific Files

| File | Purpose |
|------|---------|
| `.env.development` | Local development variables |
| `.env.production` | Production build variables |
| `.env.test` | Test environment variables |
| `.env.example` | Template for all required variables |

## Build Output

```
dist/                          # Vite build output
├── index.html
├── assets/
│   ├── index-*.js
│   ├── index-*.css
│   └── vendor-*.js
└── favicon.ico
```

## Scaling Considerations

As the project grows:

1. **Split `/api` into microservices** when complexity demands
2. **Add `/src/features` folder** for feature-based organization
3. **Move to TypeScript** for better type safety
4. **Add `/mobile` for React Native app**
5. **Add `/admin` for separate admin panel**
