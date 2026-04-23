# Frontend Modernization Plan

## Recommended Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Framework** | React 18 | Industry standard, excellent ecosystem, strong hiring signal |
| **Build Tool** | Vite | Fast HMR, optimized builds, modern dev experience |
| **Styling** | Tailwind CSS | Utility-first matches existing HTML, consistent design system |
| **State (Server)** | React Query | Industry standard for server state, caching, synchronization |
| **State (Client)** | Zustand | Lightweight, TypeScript-friendly, simpler than Redux |
| **Routing** | React Router v6 | De facto standard, excellent nested routing |
| **Forms** | React Hook Form | Performance-optimized, minimal re-renders |
| **Validation** | Zod | Type-safe, excellent DX, used by t3-stack |
| **Icons** | Lucide React | Clean, consistent, tree-shakeable |
| **Charts** | Recharts | React-native, customizable, good for dashboard |

### Why Not Next.js?

While Next.js is excellent, **Vite + React is the better choice for this project** because:

1. **No SSR needed:** This is an internal ops tool, not a public marketing site
2. **Simpler mental model:** Client-side SPA is easier to understand for portfolio
3. **Easier deployment:** Static hosting on Vercel/Netlify vs. Node.js server
4. **Clearer architecture:** Separation of frontend/backend is more explicit

Next.js would add complexity without benefit for this use case.

---

## Page/Component Breakdown

### Route Structure

```javascript
// App.jsx route configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'customers', element: <Customers /> },
      { path: 'customers/:id', element: <CustomerDetail /> },
      { path: 'trials', element: <Trials /> },
      { path: 'pre-orders', element: <PreOrders /> },
      { path: 'unconnected', element: <Unconnected /> },
      { path: 'field-ops', element: <FieldOps /> },
      { path: 'map', element: <CoverageMap /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '*', element: <NotFound /> },
]);
```

---

## Reusable Layout Components

### Layout Component Tree

```
Layout
├── TopNav
│   ├── Logo
│   ├── SearchBar (global)
│   ├── NotificationBell
│   └── UserMenu
├── Sidebar (desktop)
│   └── NavItem[]
├── MobileNav (mobile)
│   └── NavItem[]
└── Main Content Area
    └── Outlet (React Router)
```

### Layout Component Props

```javascript
// Layout.jsx
function Layout() {
  return (
    <div className="min-h-screen bg-surface">
      <TopNav />
      <div className="flex">
        <Sidebar className="hidden lg:block" />
        <main className="flex-1 p-6 pt-20 lg:p-8 lg:pt-24">
          <Outlet />
        </main>
      </div>
      <MobileNav className="lg:hidden" />
    </div>
  );
}
```

### TopNav Component

```javascript
// components/layout/TopNav.jsx
function TopNav() {
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <header className="fixed top-0 z-50 w-full h-16 bg-white/80 backdrop-blur-md border-b">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-xl font-black text-primary">FibreForge</span>
        </div>
        
        <GlobalSearch 
          value={searchQuery}
          onChange={setSearchQuery}
          className="hidden md:block w-96"
        />
        
        <div className="flex items-center gap-4">
          <NotificationBell count={3} />
          <UserMenu user={user} onLogout={logout} />
        </div>
      </div>
    </header>
  );
}
```

---

## Reusable UI Components

### Component Hierarchy

```
ui/
├── primitives/
│   ├── Button (variants: primary, secondary, ghost, danger)
│   ├── Input (with label, error, helper text)
│   ├── Select (dropdown)
│   ├── Card (container with shadow/padding variants)
│   ├── Badge (status indicators)
│   └── Avatar (user initials/image)
│
├── data-display/
│   ├── StatCard (KPI with trend)
│   ├── DataTable (sortable, filterable)
│   ├── EmptyState (illustrated empty state)
│   ├── LoadingState (skeleton)
│   └── ErrorState (error with retry)
│
├── feedback/
│   ├── Toast (notification)
│   ├── ConfirmDialog (confirmation modal)
│   ├── Modal (generic modal)
│   └── ProgressBar (linear progress)
│
└── navigation/
    ├── Tabs (horizontal/vertical)
    ├── Pagination
    ├── Breadcrumbs
    └── Dropdown
```

### Button Component API

```javascript
// components/ui/Button.jsx
function Button({
  children,
  variant = 'primary',      // primary | secondary | ghost | danger
  size = 'md',              // sm | md | lg
  isLoading = false,
  isDisabled = false,
  leftIcon = null,
  rightIcon = null,
  onClick,
  type = 'button',
  className = '',
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all';
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-surface-container text-on-surface border',
    ghost: 'text-primary hover:bg-primary/5',
    danger: 'bg-error text-white hover:bg-error-dark',
  };
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
    >
      {isLoading && <Spinner className="mr-2" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}
```

### DataTable Component API

```javascript
// components/ui/DataTable.jsx
function DataTable({
  columns,           // Array of column definitions
  data,              // Array of data objects
  isLoading = false,
  isError = false,
  error = null,
  onRowClick,
  onSort,
  sortColumn = null,
  sortDirection = 'asc',
  emptyMessage = 'No data found',
  keyExtractor = (item) => item.id,
}) {
  // Implementation with sorting, loading states, empty states
}

// Usage example
<DataTable
  columns={[
    { key: 'name', header: 'Customer', sortable: true, render: (row) => (
      <CustomerCell name={row.name} address={row.address} />
    )},
    { key: 'status', header: 'Status', render: (row) => (
      <StatusBadge status={row.status} />
    )},
    { key: 'actions', header: '', align: 'right', render: (row) => (
      <ActionMenu customer={row} />
    )},
  ]}
  data={customers}
  onRowClick={(row) => navigate(`/customers/${row.id}`)}
/>
```

---

## Reusable Domain Components

### Domain Component Patterns

```
domain/
├── CustomerCard        # Customer summary card
├── CustomerRow         # Customer table row
├── CustomerDetail      # Full customer detail view
├── TrialProgress       # Trial timeline/progress
├── TrialStatusBadge    # Trial status with icon
├── FieldTaskCard       # Field task card
├── ConnectionStatus    # Online/offline indicator
├── AddressDisplay      # Formatted address
└── ActivityLog         # Activity feed component
```

### CustomerRow Component

```javascript
// components/domain/CustomerRow.jsx
function CustomerRow({ customer, onClick }) {
  const initials = getInitials(customer.name);
  const hasMissingData = !customer.name || !customer.phone;
  
  return (
    <tr 
      onClick={() => onClick?.(customer)}
      className="group hover:bg-surface-container cursor-pointer transition-colors"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar initials={initials} fallback={customer.address?.street} />
          <div>
            <div className="font-medium text-on-surface">
              {customer.name || <span className="text-on-surface-variant italic">Unknown</span>}
            </div>
            <div className="text-sm text-on-surface-variant">
              {customer.address?.street}
            </div>
            {hasMissingData && (
              <Badge variant="warning" size="sm">Incomplete Data</Badge>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 font-mono text-sm text-on-surface-variant">
        {customer.accountId}
      </td>
      <td className="px-6 py-4">
        <CustomerStatusBadge status={customer.status} />
      </td>
      <td className="px-6 py-4 text-right">
        <ChevronRight className="inline-block text-outline group-hover:text-primary transition-colors" />
      </td>
    </tr>
  );
}
```

### FieldTaskCard Component

```javascript
// components/domain/FieldTaskCard.jsx
function FieldTaskCard({ task, onAccept, onStart, onComplete }) {
  const statusColors = {
    PENDING: 'border-secondary',
    ASSIGNED: 'border-primary',
    IN_PROGRESS: 'border-tertiary',
    URGENT: 'border-error',
  };
  
  return (
    <Card className={cn('border-l-4', statusColors[task.status])}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Badge variant={task.priority.toLowerCase()}>{task.priority}</Badge>
            <h4 className="font-bold text-lg mt-2">{task.address}</h4>
            <p className="text-sm text-on-surface-variant">{task.areaCode}</p>
          </div>
          {task.status === 'IN_PROGRESS' && (
            <ProgressRing progress={task.progress} />
          )}
        </div>
      </CardHeader>
      
      <div className="p-4 space-y-3">
        {task.technician && (
          <div className="flex items-center gap-2">
            <Avatar src={task.technician.avatar} initials={task.technician.initials} />
            <span className="text-sm">{task.technician.name}</span>
          </div>
        )}
        
        {task.notes && (
          <div className="bg-surface-container p-3 rounded-lg text-sm">
            <span className="font-medium">Note:</span> {task.notes}
          </div>
        )}
      </div>
      
      <CardFooter className="flex gap-2">
        {task.status === 'PENDING' && (
          <Button onClick={onAccept} className="flex-1">Accept</Button>
        )}
        {task.status === 'ASSIGNED' && (
          <Button onClick={onStart} className="flex-1">Start Work</Button>
        )}
        {task.status === 'IN_PROGRESS' && (
          <Button onClick={onComplete} className="flex-1">Mark Complete</Button>
        )}
      </CardFooter>
    </Card>
  );
}
```

---

## State Structure

### Zustand Store Structure

```javascript
// store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authService.login(email, password);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
```

```javascript
// store/useUiStore.js
export const useUiStore = create((set) => ({
  // Sidebar state
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  
  // Toast notifications
  toasts: [],
  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { id: Date.now(), ...toast }],
  })),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id),
  })),
  
  // Global UI state
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}));
```

### React Query Structure

```javascript
// hooks/useCustomers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useCustomers(filters = {}) {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: () => customerService.getAll(filters),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCustomer(id) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => customerService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => customerService.update(id, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', variables.id] });
    },
  });
}
```

---

## Mock Data Shape

```javascript
// utils/mockData.js

export const mockCustomers = [
  {
    id: 'cust_001',
    accountId: 'ACC-9921',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+27 82 123 4567',
    alternativePhone: '+27 11 555 0000',
    address: {
      id: 'addr_001',
      street: '45 Oak Street',
      unit: 'Block C',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2000',
      coordinates: { lat: -26.2041, lng: 28.0473 },
    },
    status: 'ACTIVE',
    plan: '1Gbps Fibre Plus',
    connection: {
      ipAddress: '192.168.10.44',
      ontStatus: 'ONLINE',
      dataUsage: 428, // GB this month
      uptime: 99.9,
    },
    billing: {
      currentBalance: 899.00,
      currency: 'ZAR',
      lastPayment: '2024-01-01',
      paymentMethod: 'Debit Order',
    },
    trial: {
      id: 'trial_001',
      status: 'CONVERTED',
      startDate: '2023-06-15',
      expiryDate: '2023-07-15',
      convertedAt: '2023-07-10',
    },
    notes: 'Customer prefers WhatsApp contact',
    createdAt: '2023-06-15',
    updatedAt: '2024-01-15',
  },
  // Customer with incomplete data (realistic)
  {
    id: 'cust_002',
    accountId: 'ACC-8812',
    name: null, // Unknown name
    email: null,
    phone: null,
    address: {
      id: 'addr_002',
      street: '89 Industrial Way',
      unit: null,
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2001',
    },
    status: 'SUSPENDED',
    plan: '500Mbps Standard',
    connection: {
      ipAddress: null,
      ontStatus: 'OFFLINE',
      dataUsage: 0,
    },
    billing: {
      currentBalance: 1450.00,
      currency: 'ZAR',
      lastPayment: null,
      overdueSince: '2023-09-01',
    },
    notes: 'Blue warehouse, ask for security at gate',
  },
];

export const mockTrials = [
  {
    id: 'trial_001',
    customerId: 'cust_001',
    customerName: 'Sarah Jenkins',
    customerAddress: '45 Oak Street, Block C',
    status: 'ACTIVE',
    plan: '1Gbps Fibre Plus',
    startDate: '2024-01-01',
    expiryDate: '2024-01-31',
    daysRemaining: 15,
    followUps: [
      { type: 'WHATSAPP', sentAt: '2024-01-20', status: 'DELIVERED' },
    ],
  },
  {
    id: 'trial_002',
    customerId: 'cust_003',
    customerName: 'Mike Ross',
    customerAddress: '89 Industrial Way',
    status: 'EXPIRED',
    plan: '200Mbps Essential',
    startDate: '2023-10-01',
    expiryDate: '2023-10-31',
    daysRemaining: -76,
    followUps: [
      { type: 'EMAIL', sentAt: '2023-10-25', status: 'BOUNCED' },
      { type: 'SMS', sentAt: '2023-10-28', status: 'DELIVERED' },
    ],
  },
];

export const mockFieldTasks = [
  {
    id: 'task_001',
    type: 'INSTALLATION',
    status: 'PENDING',
    priority: 'NORMAL',
    customerName: '42 Baker Street Resident',
    customerPhone: '+27 82 555 9876',
    address: '42 Baker Street, Greenwich',
    areaCode: 'SE10 9PB',
    coordinates: { lat: 51.4826, lng: -0.0077 },
    scheduledDate: '2024-01-16T09:00:00Z',
    estimatedDuration: 90, // minutes
    technician: null,
    progress: 0,
    notes: 'Standard residential installation',
    materials: ['ONT', 'FIBER_CABLE_50M', 'WALL_PLATE'],
  },
  {
    id: 'task_002',
    type: 'INSTALLATION',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    customerName: 'Unit 4, River Industrial Estate',
    customerPhone: '+27 11 555 4321',
    address: 'Unit 4, River Industrial Estate',
    areaCode: 'SE10 0LF',
    scheduledDate: '2024-01-15T08:00:00Z',
    estimatedDuration: 180,
    technician: {
      id: 'tech_001',
      name: 'Marcus Thorne',
      initials: 'MT',
      avatar: '/avatars/tech1.jpg',
    },
    progress: 70,
    notes: 'Pre-installed conduit blocked. Requires vacuum clearing.',
    techNote: 'Vacuum equipment on site, clearing in progress',
  },
];

export const mockUnconnected = [
  {
    id: 'addr_100',
    street: '12 Greenview Terrace',
    unit: null,
    city: 'Johannesburg',
    coordinates: { lat: -26.2051, lng: 28.0483 },
    category: 'COVERAGE',
    coverageId: 'CF-99201',
    eligibleForTrial: true,
    trialHistory: [],
    infrastructure: {
      fiberNode: 'NODE_12A',
      distance: 45, // meters
      backboneStatus: 'ACTIVE',
    },
    leadScore: 85,
    lastContacted: null,
  },
];

export const mockDashboardStats = {
  trials: {
    total: 1428,
    active: 842,
    pendingExpiry: 412,
    expired: 174,
  },
  unconnected: {
    total: 3892,
    coverage: 2104,
    preTrial: 1788,
  },
  preOrders: {
    total: 412,
    pending: 312,
    scheduled: 24,
    completed: 89,
  },
  conversionRate: 0.42,
  networkStatus: 'healthy',
};

export const mockActivities = [
  {
    id: 'act_001',
    type: 'CSV_UPLOAD',
    description: 'Trial customers database updated',
    metadata: {
      filename: 'trials_Q4_new.csv',
      recordCount: 1428,
    },
    userId: 'usr_001',
    userName: 'Admin User',
    createdAt: '2024-01-15T09:42:00Z',
  },
  {
    id: 'act_002',
    type: 'FOLLOW_UP',
    description: 'Expired user follow-up executed',
    metadata: {
      channel: 'EMAIL_SMS',
      recipientCount: 142,
    },
    userId: 'system',
    userName: 'System',
    createdAt: '2024-01-14T14:15:00Z',
  },
];
```

---

## Migration Strategy from HTML

### HTML to React Mapping

| Original HTML File | New React Component | Route |
|-------------------|---------------------|-------|
| `index.html` | `Dashboard.jsx` | `/` |
| `customers.html` | `Customers.jsx` + `CustomerDetail.jsx` | `/customers`, `/customers/:id` |
| `custOnTrial.html` | `Trials.jsx` | `/trials` |
| `preOrders.html` | `PreOrders.jsx` | `/pre-orders` |
| `unconnected.html` | `Unconnected.jsx` | `/unconnected` |
| `fieldTask.html` | `FieldOps.jsx` | `/field-ops` |

### Content Migration Checklist

For each page, extract:

1. **Header content** → PageHeader component props
2. **KPI cards** → StatCard components with mock data
3. **Tables** → DataTable component with columns config
4. **Forms** → Form components with React Hook Form
5. **Action buttons** → Button components with handlers
6. **Colors** → Tailwind config custom colors
7. **Typography** → Tailwind font classes

### Styling Migration

From inline Tailwind classes to organized approach:

```css
/* Before: Inline in HTML */
<div class="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,30,43,0.04)]">

/* After: Component abstraction */
<Card variant="elevated" className="p-6">

/* Or design token usage */
<div className="bg-surface p-6 rounded-xl shadow-card">
```

---

## Development Workflow

### Getting Started

```bash
# 1. Initialize project
npm create vite@latest fibre-forge -- --template react

# 2. Install dependencies
cd fibre-forge
npm install

# 3. Install required packages
npm install -D tailwindcss postcss autoprefixer
npm install @tanstack/react-query zustand react-router-dom lucide-react
npm install react-hook-form @hookform/resolvers zod
npm install clsx tailwind-merge

# 4. Initialize Tailwind
npx tailwindcss init -p

# 5. Configure design tokens
# Edit tailwind.config.js with custom colors

# 6. Start development
npm run dev
```

### Component Development Order

1. **Layout components** (Sidebar, TopNav) — establish structure
2. **UI primitives** (Button, Card, Badge) — build design system
3. **Data display** (StatCard, DataTable) — core data views
4. **Domain components** (CustomerRow, FieldTaskCard) — business logic
5. **Page components** (Dashboard, Customers) — compose everything
6. **Integration** (API hooks, state management) — make it work

---

## Performance Considerations

### Optimization Checklist

- [ ] Use `React.memo` for expensive components
- [ ] Use `useMemo` for expensive calculations
- [ ] Use `useCallback` for function props
- [ ] Implement virtual scrolling for long lists (>100 items)
- [ ] Lazy load page components with `React.lazy`
- [ ] Use React Query caching effectively
- [ ] Optimize images (WebP, lazy loading)
- [ ] Use `will-change` for animated elements

### Code Splitting Strategy

```javascript
// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Customers = lazy(() => import('./pages/Customers'));
const Trials = lazy(() => import('./pages/Trials'));

// Preload on hover
const preloadCustomers = () => {
  const Customers = import('./pages/Customers');
};

// In navigation
<a href="/customers" onMouseEnter={preloadCustomers}>Customers</a>
```
