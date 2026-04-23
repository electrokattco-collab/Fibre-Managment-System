# FibreForge API Overview

## Base URL

```
Development: http://localhost:3001/api
Production:  https://api.fibreforge.app/api
```

## Authentication

```http
Authorization: Bearer <token>
```

### POST /auth/login

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "usr_123", "email": "...", "role": "SALES_REP" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 150 }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid data"
  }
}
```

---

## Dashboard Endpoints

### GET /dashboard/stats

**Response:**
```json
{
  "success": true,
  "data": {
    "trials": { "total": 1428, "active": 842, "pendingExpiry": 412 },
    "unconnected": { "total": 3892 },
    "conversionRate": 0.42
  }
}
```

### GET /dashboard/activity

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "act_123",
      "type": "CSV_UPLOAD",
      "description": "Trial customers updated",
      "createdAt": "2024-01-15T09:42:00Z"
    }
  ]
}
```

---

## Customer Endpoints

### GET /customers

**Query:** `?page=1&limit=20&search=john&status=ACTIVE`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cust_123",
      "accountId": "ACC-9921",
      "name": "Sarah Jenkins",
      "address": { "street": "45 Oak Street", "city": "Johannesburg" },
      "status": "ACTIVE",
      "plan": "1Gbps Fibre Plus"
    }
  ],
  "meta": { "page": 1, "total": 150 }
}
```

### GET /customers/:id

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cust_123",
    "accountId": "ACC-9921",
    "name": "Sarah Jenkins",
    "email": "sarah@example.com",
    "phone": "+27 82 123 4567",
    "address": { ... },
    "status": "ACTIVE",
    "plan": "1Gbps Fibre Plus",
    "connection": { "ipAddress": "192.168.10.44", "ontStatus": "ONLINE" },
    "billing": { "currentBalance": 899.00 }
  }
}
```

### POST /customers

**Request:**
```json
{
  "name": "Michael Ross",
  "email": "michael@example.com",
  "phone": "+27 83 987 6543",
  "address": { "street": "89 Industrial Way", "city": "Johannesburg" }
}
```

---

## Trial Endpoints

### GET /trials

**Query:** `?status=ACTIVE&page=1`

### POST /trials

**Request:**
```json
{
  "customerId": "cust_123",
  "plan": "1Gbps Fibre Plus",
  "durationDays": 30
}
```

### POST /trials/:id/extend

**Request:**
```json
{
  "additionalDays": 14,
  "reason": "Installation delays"
}
```

### POST /trials/:id/convert

**Request:**
```json
{
  "plan": "1Gbps Fibre Plus",
  "billingCycle": "MONTHLY"
}
```

---

## Pre-Order Endpoints

### GET /pre-orders

**Query:** `?status=PENDING&technicianId=usr_tech_001`

### POST /pre-orders/:id/schedule

**Request:**
```json
{
  "scheduledDate": "2024-01-29T10:00:00Z",
  "technicianId": "usr_tech_001"
}
```

### POST /pre-orders/:id/complete

**Request:**
```json
{
  "completionNotes": "Installation successful",
  "startTrial": true,
  "trialPlan": "1Gbps Fibre Plus"
}
```

---

## Field Task Endpoints

### GET /field-tasks

**Query:** `?status=PENDING&technicianId=usr_tech_001`

### POST /field-tasks/:id/accept

### POST /field-tasks/:id/start

### POST /field-tasks/:id/complete

**Request:**
```json
{
  "completionNotes": "Done",
  "progress": 100
}
```

---

## Upload Endpoints

### POST /uploads/csv

**Content-Type:** `multipart/form-data`

**Request:** `file: <CSV file>, type: "CUSTOMERS"`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRows": 1500,
    "processedRows": 1489,
    "failedRows": 11
  }
}
```
