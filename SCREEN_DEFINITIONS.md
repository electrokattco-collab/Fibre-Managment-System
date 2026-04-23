# Screen Definitions

Comprehensive specifications for each main screen in FibreForge.

---

## 1. Dashboard

**Route:** `/`  
**Primary User:** Executive, Operations Manager, Admin  
**Purpose:** High-level operational overview and data administration

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Page Header                                                │
│ Title: "Management Overview"                               │
│ Subtitle: "Network deployment and customer acquisition"   │
│ Action: "Live Network Status" pulse indicator             │
├─────────────────────────────────────────────────────────────┤
│ KPI Cards Grid (3 columns desktop, 1 mobile)              │
│ ┌─────────────────────────┐ ┌─────────┐ ┌─────────┐       │
│ │ Total Trial Customers   │ │Unconnect│ │Pre-Order│       │
│ │ 1,428                   │ │ 3,892   │ │  412    │       │
│ │ [Status breakdown bar]  │ │         │ │         │       │
│ └─────────────────────────┘ └─────────┘ └─────────┘       │
├─────────────────────────────────────────────────────────────┤
│ CSV Data Administration Section                           │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ Upload cards:                                         │ │
│ │ • Trial Customers Data (Last updated: Today)          │ │
│ │ • Unconnected Accounts (Last updated: Oct 24)         │ │
│ │ • Pre-orders Data      (Last updated: Oct 23)         │ │
│ │ Each with: Upload button (file input), .csv label     │ │
│ └───────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Recent Activity Log                                       │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ Activity items:                                       │ │
│ │ [icon] Description                        Timestamp   │ │
│ │ [icon] Description                        Timestamp   │ │
│ │ [icon] Description                        Timestamp   │ │
│ └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Props | Description |
|-----------|-------|-------------|
| `StatCard` | `title`, `value`, `trend`, `breakdown`, `href` | KPI card with trend indicator |
| `FileUploadCard` | `title`, `lastUpdated`, `onUpload`, `accept` | CSV upload with metadata |
| `ActivityLog` | `activities`, `maxItems` | Recent activity feed |
| `NetworkStatus` | `status` | Animated pulse indicator |

### Key Actions

| Action | Handler | Result |
|--------|---------|--------|
| Click KPI Card | `navigate(to)` | Navigate to detail page |
| Upload CSV | `handleFileUpload` | Show progress, process file |
| View All Activity | `navigate('/activity')` | Full activity history |

### Status Indicators

- **Network Status:** Green pulse (healthy), Yellow (degraded), Red (outage)
- **Data Freshness:** Color-coded timestamps (Green: <24h, Yellow: <7d, Red: >7d)

### MVP Scope

**In:**
- 3 KPI cards with static data
- File upload UI (UI only, no processing)
- Activity log with static entries
- Navigation to other pages

**Out:**
- Real-time data updates
- CSV processing backend
- Activity filtering

---

## 2. Customers

**Route:** `/customers`  
**Primary User:** Call Center Agent, Sales Representative  
**Purpose:** Search, filter, and manage customer directory

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Page Header                                                │
│ Title: "Customer Directory"                                │
│ Subtitle: "Search and manage subscriber base"             │
│ Action: [+ Add Customer]                                   │
├─────────────────────────────────────────────────────────────┤
│ Filter Bar                                                │
│ [Search........................] [Status ▼] [Filters]     │
├─────────────────────────────────────────────────────────────┤
│ Customer Table                                            │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ Customer    │ Account ID │ Status      │ Plan        │ │
│ │ ──────────────────────────────────────────────────── │ │
│ │ [Avatar]    │ ACC-9921   │ [Active]    │ 1Gbps Plus │ │
│ │ Sarah J.    │            │             │             │ │
│ │ 45 Oak St   │            │             │             │ │
│ │ ──────────────────────────────────────────────────── │ │
│ │ [Avatar]    │ ACC-8812   │ [Suspended] │ 500Mbps    │ │
│ │ (Unknown)   │            │             │             │ │
│ │ 89 Ind Way  │            │             │             │ │
│ └───────────────────────────────────────────────────────┘ │
│ Pagination: [Prev] [1] [2] [3] [Next]                     │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Props | Description |
|-----------|-------|-------------|
| `SearchInput` | `value`, `onChange`, `placeholder` | Debounced search input |
| `StatusFilter` | `value`, `onChange`, `options` | Dropdown status filter |
| `CustomerTable` | `customers`, `onRowClick`, `isLoading` | Sortable data table |
| `CustomerRow` | `customer` | Individual customer row |
| `StatusBadge` | `status` | Active/Pending/Suspended badge |

### Key Actions

| Action | Handler | Result |
|--------|---------|--------|
| Search typing | `debouncedSearch` | Filter table results |
| Status filter | `filterByStatus` | Show only selected status |
| Click row | `navigate(/customers/:id)` | Open customer detail |
| Add Customer | `openModal('create')` | Show create modal |

### Filters/Search

**Search Fields:**
- Customer name (fuzzy match)
- Address (street, city)
- Account ID (exact or partial)
- Phone number

**Status Options:**
- All Statuses
- Active
- Pending Install
- Suspended
- Disconnected

### Important Status Indicators

- **Incomplete Data Badge:** Yellow warning on rows with missing name/phone
- **Overdue Badge:** Red badge on suspended accounts with balance > 0
- **Trial Badge:** Blue indicator for trial customers

### MVP Scope

**In:**
- Searchable customer table
- Status filter dropdown
- Row click to detail view
- Empty state for no results

**Out:**
- Advanced filters (date range, plan type)
- Bulk actions
- Export functionality

---

## 3. Customer Detail

**Route:** `/customers/:id`  
**Primary User:** Call Center Agent  
**Purpose:** Complete customer context for support interactions

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Back Button: ← Back to Directory                           │
├─────────────────────────────────────────────────────────────┤
│ Customer Header Card                                       │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ [Avatar]  Sarah Jenkins                               │ │
│ │           ACC-9921 • 45 Oak Street, Block C           │ │
│ │                                                      │ │
│ │ [Edit] [Run Diagnostics]                             │ │
│ └───────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Two Column Layout                                         │
│ ┌──────────────────────────┐ ┌─────────────────────────┐  │
│ │ Connection Details       │ │ Billing Overview        │  │
│ │ ─────────────────────    │ │ ─────────────────────   │  │
│ │ Plan: 1Gbps Fibre Plus   │ │ Current Balance:        │  │
│ │ ONT Status: ● Online     │ │ R 899.00               │  │
│ │ IP: 192.168.10.44        │ │                        │  │
│ │ Data Usage: 428 GB       │ │ [Process Payment]       │  │
│ │                          │ │                        │  │
│ │ [Status: Active]         │ │ Last Payment: Jan 1    │  │
│ └──────────────────────────┘ └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│ Interaction History                                       │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ [Call] Support call - Speed issue          Jan 10    │ │
│ │ [Note] Prefers WhatsApp contact            Jan 5     │ │
│ │ [Email] Trial extension sent               Dec 28    │ │
│ └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Props | Description |
|-----------|-------|-------------|
| `CustomerHeader` | `customer`, `onEdit`, `onDiagnostics` | Profile header with actions |
| `ConnectionDetails` | `connection` | Network connection info |
| `BillingOverview` | `billing`, `onPayment` | Billing summary and payment CTA |
| `InteractionList` | `interactions` | Historical interactions |

### Key Actions

| Action | Handler | Result |
|--------|---------|--------|
| Edit Profile | `openEditModal` | Open edit form |
| Run Diagnostics | `runDiagnostics` | Show diagnostic modal |
| Process Payment | `openPaymentModal` | Payment form |
| Add Note | `openNoteModal` | Add interaction note |

### MVP Scope

**In:**
- Customer header with key info
- Connection status display
- Billing overview
- Static interaction history

**Out:**
- Payment processing integration
- Real-time diagnostics
- Document uploads

---

## 4. Trials

**Route:** `/trials`  
**Primary User:** Sales Representative, Operations Manager  
**Purpose:** Trial lifecycle management and follow-up

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Page Header                                                │
│ Title: "Trial Management"                                  │
│ Subtitle: "Track and convert trial customers"             │
├─────────────────────────────────────────────────────────────┤
│ Status Summary Cards (clickable filters)                  │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐                │
│ │ Active    │ │ Pending   │ │ Expired   │                │
│ │ 842       │ │ 412       │ │ 174       │                │
│ └───────────┘ └───────────┘ └───────────┘                │
├─────────────────────────────────────────────────────────────┤
│ Tabs: [All Customers] [Trial Active] [Pending] [Expired]   │
├─────────────────────────────────────────────────────────────┤
│ Trial Table                                               │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ Customer      │ Status      │ Trial Ends │ Actions    │ │
│ │ ──────────────────────────────────────────────────── │ │
│ │ John Smith    │ [Active]    │ Oct 30     │ [View]     │ │
│ │ 123 Fibre Ln  │             │            │            │ │
│ │ ──────────────────────────────────────────────────── │ │
│ │ Sarah Jenkins │ [Expiring]  │ Oct 27 ⚠️  │ [Call][Msg]│ │
│ │ 45 Oak St     │             │ (2 days)   │            │ │
│ │ ──────────────────────────────────────────────────── │ │
│ │ Mike Ross     │ [Expired]   │ Oct 20     │ [Signup]   │ │
│ │ 89 Ind Way    │             │            │            │ │
│ └───────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Recent Trial Activities                                   │
│ [Activity feed with call logs, WhatsApp sends, etc.]      │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Props | Description |
|-----------|-------|-------------|
| `StatusSummaryCard` | `title`, `count`, `variant`, `onClick` | Clickable stat card |
| `TrialTable` | `trials`, `filter`, `onAction` | Trial list with actions |
| `TrialStatusBadge` | `status`, `daysRemaining` | Status with urgency indicator |
| `QuickActionButtons` | `trial`, `onCall`, `onMessage` | Contextual action buttons |

### Key Actions

| Action | Handler | Result |
|--------|---------|--------|
| Click status card | `filterByStatus` | Filter table by status |
| Click tab | `setFilter` | Filter table view |
| Call button | `initiateCall` | Log call attempt |
| Message button | `sendWhatsApp` | Open WhatsApp/send message |
| Send Signup Link | `generateSignupLink` | Create conversion link |

### Status Indicators

- **Active:** Green badge, no urgency
- **Expiring (≤3 days):** Yellow badge with day count
- **Expired:** Red badge with conversion CTA

### MVP Scope

**In:**
- Status summary cards
- Tab-based filtering
- Action buttons per row
- Activity feed

**Out:**
- Automated follow-up scheduling
- Bulk messaging
- Conversion analytics charts

---

## 5. Pre-Orders

**Route:** `/pre-orders`  
**Primary User:** Operations Manager, Field Manager  
**Purpose:** Installation queue and logistics management

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Page Header                                                │
│ Title: "Pre-Order & Installation"                          │
│ Subtitle: "Manage pending installs"                       │
│ Action: [Schedule Bulk Installs]                          │
├─────────────────────────────────────────────────────────────┤
│ Status Cards                                              │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│ │ Total   │ │ Awaiting│ │Scheduled│ │ Recently│          │
│ │ 1,240   │ │  312    │ │   24    │ │   89    │          │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
├─────────────────────────────────────────────────────────────┤
│ Tabs: [All] [Pending Tech] [Confirmed] [Ready for Trial]   │
├─────────────────────────────────────────────────────────────┤
│ Pre-Order Table                                           │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ Customer    │ Status        │ Install Date │ Action   │ │
│ │ ─────────────────────────────────────────────────────│ │
│ │ David P.    │ [Pending Tech]│ Not Scheduled│[Dispatch]│ │
│ │ Sky Tower   │               │              │          │ │
│ │ ─────────────────────────────────────────────────────│ │
│ │ Emily B.    │ [Scheduled]   │ Oct 29 @ 10am│[Resched] │ │
│ │ Willow Crk  │               │              │          │ │
│ │ ─────────────────────────────────────────────────────│ │
│ │ Marcus V.   │ [Installed]   │ Completed 25 │[Handover]│ │
│ │ Harbour Way │               │              │          │ │
│ └───────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Recent Logistics Updates                                  │
│ [Dispatch notifications, completions, etc.]               │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Props | Description |
|-----------|-------|-------------|
| `PreOrderTable` | `orders`, `filter` | Installation queue table |
| `LogisticsAction` | `order`, `onDispatch`, `onReschedule` | Contextual logistics buttons |
| `Toast` | `message`, `type` | Action confirmation |

### Key Actions

| Action | Handler | Result |
|--------|---------|--------|
| Dispatch Team | `dispatchTechnician` | Assign tech, show toast |
| Reschedule | `openCalendar` | Date picker modal |
| Handover | `completeAndStartTrial` | Mark done, create trial |
| Schedule Bulk | `openBulkScheduler` | Bulk scheduling interface |

### Status Flow

```
Pending → Scheduled → Installing → Installed → Handover → Trial
```

### MVP Scope

**In:**
- Queue table with status
- Dispatch action (UI only)
- Status tabs
- Logistics log

**Out:**
- Calendar integration
- Technician assignment logic
- Materials tracking

---

## 6. Unconnected (Leads)

**Route:** `/unconnected`  
**Primary User:** Sales Representative  
**Purpose:** Lead discovery and coverage-based prospecting

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Page Header                                                │
│ Title: "Unconnected Address Discovery"                     │
│ Subtitle: "Identify coverage gaps and opportunities"      │
├─────────────────────────────────────────────────────────────┤
│ Category Cards                                            │
│ ┌────────────────────┐ ┌────────────────────┐            │
│ │ Active Coverage    │ │ Pre-Trial Coverage │            │
│ │ 2,104 addresses    │ │ 1,788 addresses    │            │
│ │ No connection yet  │ │ Eligible for trial │            │
│ └────────────────────┘ └────────────────────┘            │
├─────────────────────────────────────────────────────────────┤
│ Tabs: [All Addresses] [Live Coverage] [Pre-Trial Only]     │
├─────────────────────────────────────────────────────────────┤
│ Address Table                                             │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ Address & Location │ Category │ Eligible │ Actions   │ │
│ │ ─────────────────────────────────────────────────────│ │
│ │ 12 Greenview Terr  │[Coverage]│ ✓ Eligible│[Field]   │ │
│ │ ID: CF-99201       │          │ for Trial │[Signup]  │ │
│ │ ─────────────────────────────────────────────────────│ │
│ │ 44 Marina Blvd     │[Coverage]│ ✗ Trial   │[Field]   │ │
│ │ ID: CF-88123       │          │ Used      │[Standard]│ │
│ │ ─────────────────────────────────────────────────────│ │
│ │ 78 Sunset Ridge    │[Pre-Trial│ ⏳ Pre-order│[Field] │ │
│ │ ID: PT-1102        │  Zone]   │ Eligible  │[Pre-Order]│ │
│ └───────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Sales & Field Activity                                    │
│ [Recent contact attempts, exports, etc.]                  │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Props | Description |
|-----------|-------|-------------|
| `CoverageCard` | `title`, `count`, `description`, `onClick` | Category summary |
| `AddressTable` | `addresses`, `filter` | Address list |
| `EligibilityIndicator` | `isEligible`, `reason` | Trial eligibility icon + text |
| `SalesActionMenu` | `address`, `onField`, `onSignup` | Contextual sales actions |

### Key Actions

| Action | Handler | Result |
|--------|---------|--------|
| Send to Field | `exportForField` | Export address to field team |
| Attempt Sign-up | `openSignup` | Start signup process |
| Pre-Order | `createPreOrder` | Create pre-order record |
| Export List | `exportCSV` | Download address list |

### Eligibility States

- **✓ Eligible:** Green check, full signup available
- **✗ Trial Used/Expired:** Red X, standard signup only
- **⏳ Pre-order Eligible:** Clock icon, pre-order available

### MVP Scope

**In:**
- Address table with eligibility
- Category tabs
- Action buttons per row
- Export functionality (UI)

**Out:**
- Map visualization
- Lead scoring algorithm
- Automated outreach

---

## 7. Field Operations

**Route:** `/field-ops`  
**Primary User:** Field Technician  
**Purpose:** Mobile-optimized work queue for technicians

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Map Hero Section                                          │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ [Map background with location marker]                 │ │
│ │ ┌──────────────┐                                      │ │
│ │ │ Active Sector│ North Greenwich (N-12)              │ │
│ │ │ 14 Pending   │                                     │ │
│ │ └──────────────┘                                      │ │
│ └───────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Queue Header                                              │
│ Title: "Queue Management"                                  │
│ Subtitle: "Prioritized installation list"                 │
│ Search: [..............] [Filter]                         │
├─────────────────────────────────────────────────────────────┤
│ Task Cards (asymmetric grid)                              │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐    │
│ │ [Pending]     │ │ [Urgent]      │ │ [Installing]  │    │
│ │ 42 Baker St   │ │ Unit 4, River │ │ 99 Maritime   │    │
│ │ Not Assigned  │ │ Blocked       │ │ Marcus T.     │    │
│ │ [Assign Tech] │ │ conduit       │ │ 70% complete  │    │
│ └───────────────┘ └───────────────┘ └───────────────┘    │
│ ┌───────────────┐ ┌───────────────┐                      │
│ │ [Pending]     │ │ [Pre-order]   │                      │
│ │ 12 Compass Pt │ │ New Build     │                      │
│ │ Tomorrow 9am  │ │ Backbone      │                      │
│ │ [Assign Tech] │ │ pending       │                      │
│ └───────────────┘ └───────────────┘                      │
├─────────────────────────────────────────────────────────────┤
│ Mobile Bottom Navigation (fixed)                          │
│ [Dashboard] [Customers] [Queue★] [Map]                    │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Props | Description |
|-----------|-------|-------------|
| `MapHero` | `sector`, `pendingCount` | Map with overlay info |
| `FieldTaskCard` | `task`, `onAccept`, `onStart`, `onComplete` | Task card with actions |
| `ProgressRing` | `progress` | Circular progress indicator |
| `MobileBottomNav` | `activeItem` | Fixed mobile navigation |

### Key Actions

| Action | Handler | Result |
|--------|---------|--------|
| Accept Task | `acceptTask` | Mark assigned |
| Start Work | `startTask` | Mark in-progress |
| Mark Complete | `completeTask` | Finish, add notes |
| Add Note | `addNote` | Add tech note |
| Upload Photo | `uploadPhoto` | Add documentation |

### Task Status Colors

- **Pending:** Blue left border
- **Urgent:** Red left border + warning icon
- **Installing:** Teal left border + progress ring
- **Pre-order:** Gray left border (locked)

### Mobile-First Design

- Touch-friendly buttons (min 44x44px)
- Bottom navigation for thumb reach
- Card-based layout (no tables)
- Swipe gestures (future enhancement)

### MVP Scope

**In:**
- Task cards with status
- Accept/Start/Complete actions
- Mobile-optimized layout
- Basic progress tracking

**Out:**
- Real-time map
- GPS tracking
- Offline mode
- Photo upload

---

## 8. Coverage Map

**Route:** `/map`  
**Primary User:** Sales Representative, Operations Manager  
**Purpose:** Geographic visualization of network coverage and opportunities

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Full-screen Map Interface                                  │
│ ┌───────────────────────────────────────────────────────┐ │
│ │                                                       │ │
│ │  [Satellite map view]                                 │ │
│ │                                                       │ │
│ │  ┌─────────────────┐                                  │ │
│ │  │ Coverage Filter │                                  │ │
│ │  │ [All] [Active]  │                                  │ │
│ │  │ [Pre-Trial]     │                                  │ │
│ │  └─────────────────┘                                  │ │
│ │                                                       │ │
│ │  ● Green markers = Active coverage                    │ │
│ │  ○ Blue markers = Pre-trial zones                     │ │
│ │                                                       │ │
│ │  ┌─────────────────┐                                  │ │
│ │  │ Selected:       │                                  │ │
│ │  │ 12 Greenview    │                                  │ │
│ │  │ [View Details]  │                                  │ │
│ │  └─────────────────┘                                  │ │
│ │                                                       │ │
│ └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Props | Description |
|-----------|-------|-------------|
| `MapContainer` | `center`, `zoom` | Map wrapper (Google Maps / Mapbox) |
| `CoverageMarker` | `position`, `status`, `onClick` | Colored map markers |
| `MapFilter` | `activeFilter`, `onChange` | Coverage filter controls |
| `AddressPopup` | `address`, `onView` | Clicked address details |

### Key Actions

| Action | Handler | Result |
|--------|---------|--------|
| Click Marker | `selectAddress` | Show popup |
| Filter Change | `setFilter` | Update markers |
| View Details | `navigateToAddress` | Go to address page |
| Center on Me | `centerOnLocation` | Use GPS location |

### MVP Scope

**In:**
- Static map image (placeholder)
- Filter UI
- Selected address card

**Out:**
- Interactive map
- Real markers
- KMZ layer support
- Drawing tools

---

## Summary Table

| Screen | Primary User | Complexity | Key Feature |
|--------|--------------|------------|-------------|
| Dashboard | Executive | Medium | KPI overview |
| Customers | Call Center | Medium | Search & directory |
| Customer Detail | Call Center | Low | Customer context |
| Trials | Sales | High | Lifecycle management |
| Pre-Orders | Operations | High | Queue management |
| Unconnected | Sales | Medium | Lead discovery |
| Field Ops | Technician | High | Mobile queue |
| Coverage Map | Sales | Low | Geographic view |

---

## Navigation Structure

```
Sidebar (Desktop) / Bottom Nav (Mobile)
├── Dashboard (home icon)
├── Customers (users icon)
│   └── Customer Detail
├── Trials (clock icon)
├── Pre-Orders (package icon)
├── Unconnected (map-pin icon)
├── Field Ops (wrench icon)
└── Map (map icon)
```
