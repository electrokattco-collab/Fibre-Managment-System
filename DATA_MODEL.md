# Data Model Design

## Entity Relationship Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Address    │────<│   Customer   │────<│    Trial     │
│  (central)   │     │  (primary)   │     │  (lifecycle) │
└──────────────┘     └──────────────┘     └──────────────┘
        │                     │                    │
        │              ┌──────┴──────┐            │
        │              │             │            │
        ▼              ▼             ▼            ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
│  Coverage    │ │PreOrder  │ │Connection│ │  Interaction │
│   Status     │ │  (queue) │ │  (tech)  │ │   (history)  │
└──────────────┘ └──────────┘ └──────────┘ └──────────────┘
        ▲              │             │
        │              │             │
        └──────────────┴─────────────┘
                   │
                   ▼
          ┌──────────────┐
          │  FieldTask   │
          │  (operation) │
          └──────────────┘
```

---

## Core Entities

### 1. Address

**Purpose:** Central entity for location-based operations. Addresses are the immutable anchor in a world of changing names and phone numbers.

```prisma
model Address {
  id            String   @id @default(uuid())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Location fields
  street        String
  unit          String?  // Apartment, unit, suite
  suburb        String?
  city          String
  province      String
  postalCode    String
  country       String   @default("South Africa")
  
  // Geolocation
  latitude      Float?
  longitude     Float?
  
  // Coverage information
  coverageId    String?  // Internal coverage reference (e.g., "CF-99201")
  coverageZone  String?  // Zone code (e.g., "N-12")
  
  // Infrastructure
  fiberNodeId   String?  // Connected fiber node
  distanceToNode Float?  // Meters
  
  // Status
  category      CoverageCategory @default(COVERAGE)
  eligibility   TrialEligibility @default(ELIGIBLE)
  
  // Timestamps
  lastVerified  DateTime?
  
  // Relationships
  customers     Customer[]
  preOrders     PreOrder[]
  fieldTasks    FieldTask[]
  
  // Notes
  notes         String?  // "Blue house, ask for John"
  
  @@index([street])
  @@index([city])
  @@index([coverageZone])
  @@index([category])
  @@map("addresses")
}

enum CoverageCategory {
  COVERAGE       // Live coverage, can connect
  PRE_TRIAL      // Infrastructure planned/coming
  NO_COVERAGE    // Not serviceable
}

enum TrialEligibility {
  ELIGIBLE       // Never had trial
  TRIAL_ACTIVE   // Currently in trial
  TRIAL_USED     // Had trial, not converted
  CONVERTED      // Became paying customer
  INELIGIBLE     // Technical limitation
}
```

**Incomplete Data Handling:**
- `unit` is optional (standalone houses don't have units)
- `latitude/longitude` may be null for unmapped addresses
- `coverageId` auto-generated if not provided

---

### 2. Customer

**Purpose:** Customer entity with realistic support for incomplete data.

```prisma
model Customer {
  id            String   @id @default(uuid())
  accountId     String   @unique @default(dbgenerated("'ACC-' || substr(md5(random()::text), 1, 4)"))
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Identity (all optional for data quality handling)
  firstName     String?
  lastName      String?
  companyName   String?
  
  // Contact information
  email         String?
  phone         String?
  phone2        String?  // Alternative number
  whatsapp      String?  // May differ from phone
  
  // Address (required - the anchor)
  addressId     String
  address       Address  @relation(fields: [addressId], references: [id])
  
  // Service status
  status        CustomerStatus @default(PENDING)
  plan          String?  // "1Gbps Fibre Plus", "500Mbps Standard"
  
  // Billing
  billingStatus BillingStatus @default(CURRENT)
  currentBalance Decimal @default(0)
  currency      String @default("ZAR")
  
  // Preferences
  preferredContact ContactMethod @default(PHONE)
  language      String @default("en")
  
  // Relationships
  trials        Trial[]
  preOrders     PreOrder[]
  connections   Connection[]
  interactions  Interaction[]
  fieldTasks    FieldTask[]
  
  // Metadata
  source        LeadSource @default(WALK_IN)
  notes         String?
  tags          String[]   // ["VIP", "Difficult", "Referral"]
  
  // Soft delete
  deletedAt     DateTime?
  isActive      Boolean @default(true)
  
  @@index([accountId])
  @@index([status])
  @@index([phone])
  @@index([email])
  @@index([createdAt])
  @@map("customers")
}

enum CustomerStatus {
  PENDING        // Application received, not installed
  ACTIVE         // Paying customer
  TRIAL          // In trial period
  SUSPENDED      // Non-payment or violation
  DISCONNECTED   // Service terminated
}

enum BillingStatus {
  CURRENT        // Up to date
  OVERDUE_30     // 1-30 days overdue
  OVERDUE_60     // 31-60 days overdue
  OVERDUE_90     // 60+ days overdue
  WRITTEN_OFF    // Uncollectable
}

enum ContactMethod {
  PHONE
  EMAIL
  WHATSAPP
  SMS
}

enum LeadSource {
  WALK_IN
  REFERRAL
  CALL_CENTER
  FIELD_SALES
  WEBSITE
  PARTNER
}
```

**Incomplete Data Handling:**
- `firstName/lastName` optional — display falls back to address
- `email/phone` optional — disables respective contact actions
- `plan` optional for pre-installation customers
- `companyName` used instead of personal name for business accounts

**Computed Fields:**
```javascript
// Display name logic
function getDisplayName(customer) {
  if (customer.companyName) return customer.companyName;
  if (customer.firstName || customer.lastName) {
    return [customer.firstName, customer.lastName].filter(Boolean).join(' ');
  }
  return customer.address?.street || 'Unknown';
}
```

---

### 3. Trial

**Purpose:** Trial lifecycle tracking with automated follow-up management.

```prisma
model Trial {
  id              String   @id @default(uuid())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relationship
  customerId      String
  customer        Customer @relation(fields: [customerId], references: [id])
  
  // Trial configuration
  plan            String   // Plan during trial
  startDate       DateTime @default(now())
  durationDays    Int      @default(30)
  expiryDate      DateTime
  
  // Status tracking
  status          TrialStatus @default(ACTIVE)
  
  // Conversion tracking
  convertedAt     DateTime?
  convertedToPlan String?
  conversionValue Decimal?  // Monthly recurring revenue
  
  // Follow-up tracking
  followUps       FollowUp[]
  
  // Source tracking
  source          String?   // "Field sales", "Referral", etc.
  notes           String?
  
  // Computed (for query performance)
  daysRemaining   Int?      // Calculated field
  
  @@index([customerId])
  @@index([status])
  @@index([expiryDate])
  @@index([createdAt])
  @@map("trials")
}

enum TrialStatus {
  ACTIVE         // Currently active
  PENDING_EXPIRY // 3 days or less remaining
  EXPIRED        // Past expiry date, not converted
  CONVERTED      // Became paying customer
  CANCELLED      // Manually cancelled
  EXTENDED       // Expiry extended
}

model FollowUp {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())
  
  trialId     String
  trial       Trial    @relation(fields: [trialId], references: [id], onDelete: Cascade)
  
  type        FollowUpType
  status      FollowUpStatus @default(SCHEDULED)
  scheduledAt DateTime?
  sentAt      DateTime?
  
  // Content
  subject     String?
  content     String?
  
  // Results
  deliveredAt DateTime?
  openedAt    DateTime?
  clickedAt   DateTime?
  
  // User reference
  sentById    String?  // System or user ID
  notes       String?
  
  @@index([trialId])
  @@index([status])
  @@map("follow_ups")
}

enum FollowUpType {
  EMAIL
  SMS
  WHATSAPP
  CALL
  DOOR_KNOCK
}

enum FollowUpStatus {
  SCHEDULED
  SENT
  DELIVERED
  OPENED
  BOUNCED
  FAILED
}
```

---

### 4. PreOrder

**Purpose:** Installation queue management with logistics tracking.

```prisma
model PreOrder {
  id              String   @id @default(uuid())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relationships
  customerId      String
  customer        Customer @relation(fields: [customerId], references: [id])
  
  addressId       String
  address         Address  @relation(fields: [addressId], references: [id])
  
  // Order details
  plan            String
  status          PreOrderStatus @default(PENDING)
  
  // Scheduling
  requestedDate   DateTime?  // Customer preference
  scheduledDate   DateTime?  // Confirmed installation date
  scheduledSlot   String?    // "09:00-12:00", "13:00-17:00"
  
  // Assignment
  technicianId    String?
  technician      User?      @relation(fields: [technicianId], references: [id])
  
  // Timing
  estimatedDuration Int?     // Minutes
  startedAt       DateTime?
  completedAt     DateTime?
  
  // Materials
  materials       PreOrderMaterial[]
  
  // Workflow
  fieldTaskId     String?    // Linked field task
  trialId         String?    // Created trial after completion
  
  // Notes
  customerNotes   String?    // "Available weekends only"
  technicianNotes String?    // "Security gate code: 1234"
  internalNotes   String?    // Ops team notes
  
  // Completion
  completionPhotos String[]  // URLs to photos
  customerSignature String?  // Base64 signature
  
  @@index([customerId])
  @@index([status])
  @@index([scheduledDate])
  @@index([technicianId])
  @@map("pre_orders")
}

enum PreOrderStatus {
  PENDING        // Awaiting scheduling
  SCHEDULED      // Date confirmed
  ASSIGNED       // Technician assigned
  IN_PROGRESS    // Installation started
  COMPLETED      // Installation done
  CANCELLED      // Order cancelled
  NO_SHOW        // Customer not available
  REQUIRES_REVISIT // Needs additional work
}

model PreOrderMaterial {
  id          String @id @default(uuid())
  preOrderId  String
  preOrder    PreOrder @relation(fields: [preOrderId], references: [id], onDelete: Cascade)
  
  materialCode String  // "ONT_001", "CABLE_50M"
  materialName String
  quantity     Int     @default(1)
  isInstalled  Boolean @default(false)
  
  @@index([preOrderId])
  @@map("pre_order_materials")
}
```

---

### 5. FieldTask

**Purpose:** Technician work queue with progress tracking.

```prisma
model FieldTask {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Task classification
  type        TaskType @default(INSTALLATION)
  priority    Priority @default(NORMAL)
  status      TaskStatus @default(PENDING)
  
  // Location
  addressId   String
  address     Address  @relation(fields: [addressId], references: [id])
  
  // Customer (may be null for new installations)
  customerId  String?
  customer    Customer? @relation(fields: [customerId], references: [id])
  
  // Assignment
  technicianId String?
  technician   User?     @relation("TechnicianTasks", fields: [technicianId], references: [id])
  assignedById String?
  assignedAt   DateTime?
  
  // Scheduling
  scheduledDate DateTime?
  estimatedDuration Int? // Minutes
  
  // Progress tracking
  acceptedAt  DateTime?
  startedAt   DateTime?
  completedAt DateTime?
  progress    Int       @default(0) // 0-100
  
  // Related records
  preOrderId  String?
  preOrder    PreOrder? @relation(fields: [preOrderId], references: [id])
  
  // Content
  description String?
  notes       String?   // Technician notes
  issues      String?   // Problems encountered
  
  // Media
  photos      TaskPhoto[]
  
  // Completion
  completionNotes String?
  customerSignature String?
  materialsUsed   String[] // Material codes
  
  @@index([technicianId])
  @@index([status])
  @@index([scheduledDate])
  @@index([priority])
  @@map("field_tasks")
}

enum TaskType {
  INSTALLATION
  REPAIR
  MAINTENANCE
  INSPECTION
  DISCONNECT
}

enum Priority {
  LOW
  NORMAL
  HIGH
  URGENT
}

enum TaskStatus {
  PENDING        // Awaiting assignment
  ASSIGNED       // Assigned to technician
  ACCEPTED       // Technician accepted
  IN_PROGRESS    // Work started
  COMPLETED      // Work done
  CANCELLED      // Task cancelled
  BLOCKED        // Blocked by external factor
}

model TaskPhoto {
  id          String @id @default(uuid())
  taskId      String
  task        FieldTask @relation(fields: [taskId], references: [id], onDelete: Cascade)
  
  url         String   // Photo URL
  caption     String?
  takenAt     DateTime @default(now())
  
  @@index([taskId])
  @@map("task_photos")
}
```

---

### 6. Connection (Service Status)

**Purpose:** Technical connection details and monitoring.

```prisma
model Connection {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relationship
  customerId  String
  customer    Customer @relation(fields: [customerId], references: [id])
  
  // Network details
  ipAddress   String?
  subnetMask  String?
  gateway     String?
  dnsPrimary  String?
  dnsSecondary String?
  
  // Equipment
  ontSerial   String?  // ONT device serial
  ontMac      String?
  ontStatus   OntStatus @default(OFFLINE)
  
  // Performance
  provisionedSpeedDown Int?  // Mbps
  provisionedSpeedUp   Int?  // Mbps
  
  // Usage tracking
  dataUsageMonth   Float @default(0) // GB
  dataUsageTotal   Float @default(0) // GB
  lastUsageUpdate  DateTime?
  
  // Status
  status      ConnectionStatus @default(PENDING)
  activatedAt DateTime?
  suspendedAt DateTime?
  
  // Monitoring
  lastSeenAt  DateTime?
  uptimePercent Float @default(100)
  
  @@index([customerId])
  @@index([ontStatus])
  @@map("connections")
}

enum OntStatus {
  ONLINE
  OFFLINE
  WARNING
  UNKNOWN
}

enum ConnectionStatus {
  PENDING        // Awaiting installation
  ACTIVE         // Normal operation
  SUSPENDED      // Billing or admin suspension
  DEGRADED       // Performance issues
  DISCONNECTED   // Physically disconnected
}
```

---

### 7. Interaction

**Purpose:** Complete interaction history across all channels.

```prisma
model Interaction {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())
  
  // Who
  customerId  String
  customer    Customer @relation(fields: [customerId], references: [id])
  
  userId      String?  // Staff member (null for system)
  user        User?    @relation(fields: [userId], references: [id])
  
  // What
  type        InteractionType
  channel     Channel
  direction   Direction      // INBOUND or OUTBOUND
  
  // Content
  subject     String?
  notes       String
  attachments String[]       // File URLs
  
  // Classification
  category    InteractionCategory @default(GENERAL)
  outcome     InteractionOutcome?
  
  // Follow-up
  followUpRequired Boolean @default(false)
  followUpDate     DateTime?
  
  // Related records
  trialId     String?
  preOrderId  String?
  fieldTaskId String?
  
  // External references
  externalId  String?  // ViciDial call ID, WhatsApp message ID, etc.
  
  @@index([customerId])
  @@index([createdAt])
  @@index([type])
  @@map("interactions")
}

enum InteractionType {
  CALL
  EMAIL
  SMS
  WHATSAPP
  CHAT
  NOTE
  SYSTEM
}

enum Channel {
  PHONE
  EMAIL
  SMS
  WHATSAPP
  PORTAL
  IN_PERSON
  SYSTEM
}

enum Direction {
  INBOUND
  OUTBOUND
}

enum InteractionCategory {
  GENERAL
  SALES
  SUPPORT
  BILLING
  TECHNICAL
  COMPLAINT
  FEEDBACK
}

enum InteractionOutcome {
  RESOLVED
  ESCALATED
  FOLLOW_UP_REQUIRED
  NO_ANSWER
  WRONG_NUMBER
  NOT_INTERESTED
  CONVERTED
}
```

---

### 8. User (Staff)

**Purpose:** System users with role-based access.

```prisma
model User {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Identity
  email       String   @unique
  password    String   // Hashed
  firstName   String
  lastName    String
  phone       String?
  
  // Role & permissions
  role        UserRole @default(SALES_REP)
  permissions String[] // Additional granular permissions
  
  // Status
  isActive    Boolean @default(true)
  lastLoginAt DateTime?
  
  // Profile
  avatar      String?  // URL
  employeeId  String?
  department  String?
  
  // Field tech specific
  vehicleId   String?
  serviceArea String?
  
  // Relationships
  assignedTasks    FieldTask[] @relation("TechnicianTasks")
  interactions     Interaction[]
  activities       Activity[]
  
  @@index([email])
  @@index([role])
  @@map("users")
}

enum UserRole {
  ADMIN
  EXECUTIVE
  OPERATIONS_MANAGER
  SALES_REP
  CALL_CENTER
  FIELD_TECHNICIAN
  VIEWER
}
```

---

### 9. Activity (Audit Log)

**Purpose:** System-wide activity logging for audit and dashboard.

```prisma
model Activity {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())
  
  // Who
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  
  // What
  type        ActivityType
  description String
  
  // Context
  entityType  String?  // "Customer", "Trial", etc.
  entityId    String?  // ID of affected entity
  
  // Metadata
  metadata    Json?    // Flexible additional data
  ipAddress   String?
  userAgent   String?
  
  @@index([createdAt])
  @@index([type])
  @@index([userId])
  @@map("activities")
}

enum ActivityType {
  // Auth
  LOGIN
  LOGOUT
  PASSWORD_CHANGE
  
  // Data
  CUSTOMER_CREATED
  CUSTOMER_UPDATED
  CUSTOMER_DELETED
  
  // Trials
  TRIAL_STARTED
  TRIAL_EXTENDED
  TRIAL_EXPIRED
  TRIAL_CONVERTED
  
  // Orders
  PREORDER_CREATED
  PREORDER_SCHEDULED
  PREORDER_COMPLETED
  
  // Field
  TASK_ASSIGNED
  TASK_ACCEPTED
  TASK_COMPLETED
  
  // Data import
  CSV_UPLOADED
  BULK_IMPORT
  
  // System
  EXPORT_GENERATED
  NOTIFICATION_SENT
}
```

---

## Data Integrity Rules

### 1. Address Uniqueness

```sql
-- Prevent duplicate addresses
CREATE UNIQUE INDEX idx_address_unique 
ON addresses (LOWER(street), LOWER(unit), LOWER(city));
```

### 2. Trial Date Validation

```javascript
// Ensure expiry_date > start_date
// Ensure only one active trial per customer
```

### 3. Status Transition Rules

| From | To | Allowed? | Notes |
|------|-----|----------|-------|
| PENDING | ACTIVE | Yes | After installation |
| ACTIVE | SUSPENDED | Yes | Non-payment |
| SUSPENDED | ACTIVE | Yes | Payment received |
| ACTIVE | DISCONNECTED | Yes | Account closure |
| DISCONNECTED | ACTIVE | No | Must create new account |

### 4. Field Task Assignment

- Only users with `FIELD_TECHNICIAN` role can be assigned tasks
- One active `IN_PROGRESS` task per technician maximum

---

## Query Patterns

### Dashboard Stats

```sql
-- Trial breakdown
SELECT 
  COUNT(*) FILTER (WHERE status = 'ACTIVE') as active,
  COUNT(*) FILTER (WHERE status = 'PENDING_EXPIRY') as pending_expiry,
  COUNT(*) FILTER (WHERE status = 'EXPIRED') as expired
FROM trials;

-- Conversion rate
SELECT 
  COUNT(*) FILTER (WHERE status = 'CONVERTED')::float / 
  NULLIF(COUNT(*) FILTER (WHERE status IN ('CONVERTED', 'EXPIRED')), 0) 
  as conversion_rate
FROM trials;
```

### Customer Search

```sql
-- Flexible search across multiple fields
SELECT * FROM customers
WHERE 
  LOWER(first_name || ' ' || last_name) LIKE LOWER('%search%')
  OR LOWER(company_name) LIKE LOWER('%search%')
  OR phone LIKE '%search%'
  OR email LIKE LOWER('%search%')
  OR account_id LIKE UPPER('%search%')
  OR EXISTS (
    SELECT 1 FROM addresses 
    WHERE addresses.id = customers.address_id
    AND LOWER(street) LIKE LOWER('%search%')
  );
```

### Field Task Queue

```sql
-- Today's tasks for technician
SELECT * FROM field_tasks
WHERE technician_id = 'tech_id'
  AND scheduled_date::date = CURRENT_DATE
  AND status IN ('ASSIGNED', 'ACCEPTED', 'IN_PROGRESS')
ORDER BY 
  CASE priority 
    WHEN 'URGENT' THEN 1 
    WHEN 'HIGH' THEN 2 
    WHEN 'NORMAL' THEN 3 
    ELSE 4 
  END,
  scheduled_date;
```

---

## Index Strategy

```sql
-- Customers
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_created ON customers(created_at DESC);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_name ON customers USING gin(first_name gin_trgm_ops);

-- Trials
CREATE INDEX idx_trials_status ON trials(status);
CREATE INDEX idx_trials_expiry ON trials(expiry_date);
CREATE INDEX idx_trials_customer ON trials(customer_id);

-- Field Tasks
CREATE INDEX idx_tasks_technician ON field_tasks(technician_id);
CREATE INDEX idx_tasks_status ON field_tasks(status);
CREATE INDEX idx_tasks_scheduled ON field_tasks(scheduled_date);

-- Interactions
CREATE INDEX idx_interactions_customer ON interactions(customer_id);
CREATE INDEX idx_interactions_created ON interactions(created_at DESC);

-- Addresses
CREATE INDEX idx_addresses_coverage ON addresses(coverage_zone);
CREATE INDEX idx_addresses_category ON addresses(category);
CREATE INDEX idx_addresses_coords ON addresses USING gist(
  ll_to_earth(latitude, longitude)
);
```

---

## Soft Delete Pattern

All main entities use soft delete:

```prisma
// In each model:
deletedAt DateTime?
isActive  Boolean @default(true)
```

Queries should filter:
```javascript
// Instead of
prisma.customer.findMany()

// Use
prisma.customer.findMany({
  where: { isActive: true }
})
```

Admin functions can view deleted records:
```javascript
prisma.customer.findMany({
  where: { isActive: false }
})
```
