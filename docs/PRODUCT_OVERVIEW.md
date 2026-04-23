# FibreForge Product Overview

## Vision

FibreForge is the internal operations platform that fiber network providers wish they had from day one. It transforms chaotic, spreadsheet-driven workflows into streamlined, role-based operational excellence.

---

## Problem Domain

### The FTTH Operations Challenge

Fiber to the Home (FTTH) deployments involve complex coordination between multiple teams:

1. **Sales & Marketing** need to identify serviceable addresses and track leads
2. **Call Centers** need complete customer context during support interactions
3. **Field Operations** need mobile-optimized work queues
4. **Executives** need visibility into conversion rates
5. **Operations** need to manage data imports

### Real-World Data Complexity

Fiber operations deal with messy, real-world data:

- **Addresses as primary identifiers** — "The blue house on Oak Street"
- **Incomplete contact information** — customers with no email or phone
- **Multiple phone numbers** — work, home, mobile
- **Informal names** — "John at the corner shop"

---

## Solution Overview

### Core Philosophy

**"Address-first, status-driven, role-appropriate"**

### User Personas

**1. Executive / Operations Manager (Thabo)**
- **Goals:** Monitor trial conversion, identify coverage gaps, track productivity
- **Pain Points:** Can't see real-time metrics, scattered data
- **Solution:** Dashboard with real-time KPIs, coverage analytics

**2. Sales Representative (Lerato)**
- **Goals:** Identify serviceable addresses, enroll trials, follow up
- **Pain Points:** Don't know which addresses are covered
- **Solution:** Unconnected leads view, trial management

**3. Call Center Agent (Sipho)**
- **Goals:** Quickly find customer records, see account context
- **Pain Points:** Customers can't be found by partial info
- **Solution:** Flexible search, complete customer profile

**4. Field Technician (James)**
- **Goals:** See assigned jobs, update progress, document issues
- **Pain Points:** Paper lists, no real-time updates
- **Solution:** Mobile-optimized work queue

---

## Core Workflows

### Workflow 1: Lead to Trial Conversion
```
Unconnected Address → Pre-order → Installation → Trial Active → Converted/Expired
```

### Workflow 2: Support Interaction
```
Customer Call → Search by any identifier → View complete context → Resolve
```

### Workflow 3: Field Operation
```
Job Assignment → Technician Acceptance → In Progress → Complete → Handover
```

---

## Feature Modules

### Dashboard Module
- KPI cards: Total trials, unconnected, pre-orders, conversion rate
- Network status indicator
- CSV upload interface
- Recent activity audit log

### Customer Management Module
- Searchable, filterable customer table
- Detail view with connection diagnostics
- Status management (Active, Suspended, Pending)
- Billing overview integration

### Trial Management Module
- Trial status dashboard (Active, Pending Expiry, Expired)
- Automated follow-up queue
- Conversion tracking
- Bulk reminder dispatch

### Unconnected / Coverage Module
- Serviceable address database
- Pre-trial zone identification
- Lead scoring
- Export tools for field sales

### Pre-Order / Logistics Module
- Pre-order queue management
- Installation scheduling
- Technician dispatch
- Handover workflow

### Field Operations Module
- Optimized work queue
- Job detail cards
- Status updates
- Progress indicators

---

## Data Philosophy

### Address as Primary Key

In the real world, addresses are more reliable than names or phone numbers.

### Graceful Degradation

| Data Field | Required? | Fallback Behavior |
|------------|-----------|-------------------|
| Address | Yes | Cannot create record |
| Customer Name | No | Display "Unknown" |
| Phone Number | No | Disable call/SMS |
| Email | No | Disable email |
| Account ID | Auto-generated | System assigns |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Trial conversion rate | > 40% |
| Time to install | < 7 days |
| Data import speed | > 5,000 records/minute |
| Search response time | < 500ms |
| Field update sync | < 5 seconds |

---

## Glossary

| Term | Definition |
|------|------------|
| **FTTH** | Fiber to the Home |
| **ONT** | Optical Network Terminal |
| **Pre-trial zone** | Area with infrastructure but not yet open |
| **Unconnected** | Address with coverage but no service |
| **Trial** | Limited-time free/discounted service |
| **Handover** | Transfer from install to customer success |
