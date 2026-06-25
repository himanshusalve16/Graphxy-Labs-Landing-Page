# Clampbox API Reference

> **Purpose:** Comprehensive documentation of all Clampbox API endpoints, request/response formats, authentication, and integration examples.

## Table of Contents

1. [Base URL & Authentication](#1-base-url--authentication)
2. [Health Check](#2-health-check)
3. [Dashboard Metrics](#3-dashboard-metrics)
4. [Policies](#4-policies)
5. [Gateway Keys](#5-gateway-keys)
6. [Prompt Inspection (Risk Engine)](#6-prompt-inspection-risk-engine)
7. [Audit Logs](#7-audit-logs)
8. [Vault (Credential Storage)](#8-vault-credential-storage)
9. [Settings](#9-settings)
10. [Error Responses](#10-error-responses)

---

## 1. Base URL & Authentication

### Base URL

| Environment | Base URL |
|---|---|
| **Local Development** | `http://localhost:5000/api/clampbox` |
| **Production** | `https://clampbox-api.onrender.com/api/clampbox` |

### Authentication Header

All requests to gateway/inspection endpoints must include a Gateway Key header:

```http
X-Clampbox-Key: cb_gt_9f02...1a3b
```

Gateway keys are generated from the **Gateway Keys** section of the Clampbox dashboard.

---

## 2. Health Check

```http
GET /health
```

Returns service status. Used by deployment health monitors.

**Response `200 OK`:**
```json
{
  "status": "ok",
  "timestamp": "2026-06-25T15:00:00Z"
}
```

---

## 3. Dashboard Metrics

```http
GET /api/clampbox/dashboard
```

Returns aggregated real-time metrics and recent activity for the console overview.

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "requestsToday": 2341,
      "blockedToday": 12,
      "redactedToday": 45,
      "highRiskToday": 2,
      "blockRate": 0.5,
      "redactRate": 1.9,
      "activeKeys": 3,
      "activePolicies": 7
    },
    "recentActivity": [
      {
        "id": "event_01",
        "createdAt": "2026-06-25T18:30:00Z",
        "source": "gateway",
        "provider": "openai",
        "action": "redact",
        "riskScore": 42
      }
    ]
  }
}
```

---

## 4. Policies

### List All Policies

```http
GET /api/clampbox/policies
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pol_uuid",
      "name": "Block JWT Credentials",
      "description": "Scan and block JSON Web Tokens in prompts.",
      "action": "block",
      "priority": 100,
      "enabled": true,
      "createdAt": "2026-06-01T00:00:00Z"
    }
  ]
}
```

### Create Policy

```http
POST /api/clampbox/policies
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Block JWT Credentials",
  "description": "Scan and block JSON Web Tokens in prompts.",
  "action": "block",
  "priority": 100
}
```

Valid `action` values: `block`, `redact`, `warn`, `allow`

**Response `201 Created`:**
```json
{
  "success": true,
  "data": { "id": "pol_uuid", ... }
}
```

### Delete Policy

```http
DELETE /api/clampbox/policies/:id
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Policy deleted."
}
```

---

## 5. Gateway Keys

### List All Keys

```http
GET /api/clampbox/gateway-keys
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "key_uuid",
      "label": "Production App Key",
      "keyPrefix": "cb_gt_9f02",
      "createdAt": "2026-06-01T00:00:00Z"
    }
  ]
}
```

> [!NOTE]
> The full key value is only returned at creation time. Store it securely — it cannot be retrieved again.

### Generate Key

```http
POST /api/clampbox/gateway-keys
Content-Type: application/json
```

**Request Body:**
```json
{
  "label": "Production App Key"
}
```

**Response `201 Created`:**
```json
{
  "success": true,
  "data": {
    "id": "key_uuid",
    "label": "Production App Key",
    "key": "cb_gt_9f02...1a3b"
  }
}
```

### Revoke Key

```http
DELETE /api/clampbox/gateway-keys/:id
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Gateway key revoked."
}
```

---

## 6. Prompt Inspection (Risk Engine)

```http
POST /api/clampbox/risk/inspect
X-Clampbox-Key: cb_gt_9f02...1a3b
Content-Type: application/json
```

**Request Body:**
```json
{
  "prompt": "Here is my OpenAI key: sk-proj-abc123... please help me debug"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "action": "block",
    "riskScore": 92,
    "detections": [
      {
        "type": "api_key",
        "classification": "Infrastructure",
        "offset": [27, 51],
        "redactedAs": "[REDACTED_API_KEY_1]"
      }
    ],
    "redactedPrompt": "Here is my OpenAI key: [REDACTED_API_KEY_1] please help me debug"
  }
}
```

**Action values:**
| Action | Meaning |
|---|---|
| `allow` | Prompt is clean, no threats detected |
| `redact` | Prompt contains sensitive data — redacted version provided |
| `warn` | Prompt is suspicious — client should confirm before proceeding |
| `block` | Prompt violates policy — submission must be prevented |

---

## 7. Audit Logs

```http
GET /api/clampbox/audit-logs
```

Returns immutable, paginated compliance records of all intercepted events.

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `page` | Integer | Page number (default: 1) |
| `limit` | Integer | Records per page (default: 20, max: 100) |

**Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "log_uuid",
      "createdAt": "2026-06-25T18:30:00Z",
      "source": "extension",
      "provider": "openai",
      "action": "block",
      "riskScore": 87,
      "detectionCount": 2
    }
  ],
  "meta": {
    "total": 2341,
    "page": 1,
    "limit": 20
  }
}
```

---

## 8. Vault (Credential Storage)

### List Vault Entries

```http
GET /api/clampbox/vault
```

Returns credential metadata only — **raw keys are never returned**.

**Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "vault_uuid",
      "provider": "openai",
      "label": "core-prod-openai-key",
      "environment": "production",
      "createdAt": "2026-06-01T00:00:00Z"
    }
  ]
}
```

### Store Provider Key

```http
POST /api/clampbox/vault
Content-Type: application/json
```

**Request Body:**
```json
{
  "provider": "openai",
  "label": "core-prod-openai-key",
  "rawKey": "sk-proj-abc...",
  "environment": "production"
}
```

**Supported providers:** `openai`, `anthropic`, `gemini`, `groq`, `perplexity`

**Response `201 Created`:**
```json
{
  "success": true,
  "data": { "id": "vault_uuid" }
}
```

### Revoke Vault Entry

```http
DELETE /api/clampbox/vault/:id
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Vault entry deleted."
}
```

---

## 9. Settings

### Get Settings

```http
GET /api/clampbox/settings
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "defaultAction": "warn",
    "auditRetentionDays": 90,
    "rateLimitWindowSeconds": 60,
    "rateLimitMaxRequests": 100
  }
}
```

### Update Settings

```http
PUT /api/clampbox/settings
Content-Type: application/json
```

**Request Body:**
```json
{
  "defaultAction": "block",
  "auditRetentionDays": 180
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Settings saved."
}
```

---

## 10. Error Responses

All error responses follow a consistent format:

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Status | Meaning |
|---|---|
| `200 OK` | Request successful |
| `201 Created` | Resource created |
| `400 Bad Request` | Validation error or malformed request body |
| `401 Unauthorized` | Missing or invalid gateway key |
| `403 Forbidden` | Blocked by security policy |
| `404 Not Found` | Resource does not exist |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unexpected server error |
