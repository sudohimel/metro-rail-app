# API Documentation - Metro Rail App

Complete reference for all Metro Rail App REST API endpoints with request/response examples, authentication details, and error handling.

## Table of Contents
1. [Base Information](#base-information)
2. [Authentication](#authentication)
3. [User Endpoints](#user-endpoints)
4. [Location Endpoints](#location-endpoints)
5. [Train Schedule Endpoints](#train-schedule-endpoints)
6. [Journey Endpoints](#journey-endpoints)
7. [Admin Endpoints](#admin-endpoints)
8. [Error Responses](#error-responses)
9. [Rate Limiting](#rate-limiting)

---

## Base Information

### Server Details
- **Base URL:** `http://localhost:3000`
- **Protocol:** HTTP/HTTPS
- **Content-Type:** `application/json`
- **Response Format:** JSON

### HTTP Method Conventions
- `GET` - Retrieve resources
- `POST` - Create new resources
- `PUT` - Update existing resources
- `DELETE` - Remove resources

### Response Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Authentication

### JWT Token Usage

All protected endpoints require JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Token Acquisition Flow

1. **Register** → Get OTP
2. **Confirm OTP** → Account verified
3. **Login** → Get OTP
4. **Confirm OTP** → Receive JWT token
5. **Use Token** → Add to Authorization header

### Token Format

```
Header:
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Token Expiration
- **Default:** 3600 seconds (1 hour)
- **Configurable:** Set `JWT_EXPIRATION_TIME` in `.env`
- **Refresh:** Must login again after expiration

---

## User Endpoints

### 1. User Registration

**Endpoint:** `POST /user/signUp`

**Description:** Register a new user with email and password. Generates and sends OTP to email.

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "phone": "+1234567890"
}
```

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "message": "OTP sent to your email",
  "timestamp": "2024-04-10T10:30:00.000Z"
}
```

**Response (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "Email must be a valid email address",
  "error": "Bad Request"
}
```

**Response (409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

**Validation Rules:**
- Email: Valid email format, max 255 chars
- Password: Min 8 characters, max 255 chars
- Phone: Optional, valid phone format

**Example using cURL:**
```bash
curl -X POST http://localhost:3000/user/signUp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "phone": "+1234567890"
  }'
```

---

### 2. Confirm User Registration

**Endpoint:** `POST /user/signUpConfirmation`

**Description:** Confirm user registration by verifying OTP sent to email.

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Signup confirmed successfully. You can now login.",
  "timestamp": "2024-04-10T10:35:00.000Z"
}
```

**Response (400 Bad Request - Invalid OTP):**
```json
{
  "statusCode": 400,
  "message": "Invalid OTP",
  "error": "Bad Request"
}
```

**Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

**OTP Details:**
- Format: 6 numeric digits (100000-999999)
- Validity: 15 minutes
- Sent to: Registered email address

---

### 3. User Login

**Endpoint:** `POST /user/login`

**Description:** Initiate login process. Generates and sends OTP to email for verification.

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "OTP sent to your email for verification",
  "timestamp": "2024-04-10T10:40:00.000Z"
}
```

**Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

**Response (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "Email and password are required",
  "error": "Bad Request"
}
```

---

### 4. Confirm User Login

**Endpoint:** `POST /user/loginConfirmation`

**Description:** Verify OTP and receive JWT authentication token.

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTcxMjc0ODAwMCwiZXhwIjoxNzEyNzUxNjAwfQ.signature_here",
  "expiresIn": 3600,
  "timestamp": "2024-04-10T10:45:00.000Z"
}
```

**Response (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "Invalid OTP",
  "error": "Bad Request"
}
```

**Token Information:**
- Contains: `userId`, `email`, `iat`, `exp`
- Expires in: 3600 seconds (1 hour)
- Use in: `Authorization: Bearer <token>`

**Example using cURL:**
```bash
curl -X POST http://localhost:3000/user/loginConfirmation \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

---

## Location Endpoints

### 1. Create Location

**Endpoint:** `POST /location/location`

**Description:** Create a new metro station/location.

**Authentication:** Required (Admin recommended)

**Request Body:**
```json
{
  "name": "Central Station",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "description": "Main station in downtown area"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Central Station",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "description": "Main station in downtown area",
  "createdAt": "2024-04-10T10:50:00.000Z",
  "updatedAt": "2024-04-10T10:50:00.000Z"
}
```

---

### 2. Get All Locations

**Endpoint:** `GET /location/location`

**Description:** Retrieve all metro stations.

**Authentication:** Optional

**Query Parameters:** None

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Central Station",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "description": "Main station in downtown area",
    "createdAt": "2024-04-10T10:50:00.000Z",
    "updatedAt": "2024-04-10T10:50:00.000Z"
  },
  {
    "id": 2,
    "name": "North Station",
    "latitude": 40.7280,
    "longitude": -73.9813,
    "description": "Northern terminal",
    "createdAt": "2024-04-10T10:55:00.000Z",
    "updatedAt": "2024-04-10T10:55:00.000Z"
  }
]
```

**Example using cURL:**
```bash
curl -X GET http://localhost:3000/location/location
```

---

### 3. Get Location by ID

**Endpoint:** `GET /location/location/:id`

**Description:** Retrieve specific location by ID.

**Authentication:** Optional

**URL Parameters:**
- `id` (required): Location ID (integer)

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Central Station",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "description": "Main station in downtown area",
  "createdAt": "2024-04-10T10:50:00.000Z",
  "updatedAt": "2024-04-10T10:50:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Location not found",
  "error": "Not Found"
}
```

**Example:**
```bash
curl -X GET http://localhost:3000/location/location/1
```

---

### 4. Update Location

**Endpoint:** `PUT /location/location/:id`

**Description:** Update existing location details.

**Authentication:** Required (Admin required)

**URL Parameters:**
- `id` (required): Location ID (integer)

**Request Body:**
```json
{
  "name": "Central Station Updated",
  "latitude": 40.7130,
  "longitude": -74.0062,
  "description": "Updated main station"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Central Station Updated",
  "latitude": 40.7130,
  "longitude": -74.0062,
  "description": "Updated main station",
  "createdAt": "2024-04-10T10:50:00.000Z",
  "updatedAt": "2024-04-10T11:00:00.000Z"
}
```

---

### 5. Delete Location

**Endpoint:** `DELETE /location/location/:id`

**Description:** Remove a location (and associated schedules if cascade enabled).

**Authentication:** Required (Admin required)

**URL Parameters:**
- `id` (required): Location ID (integer)

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Location deleted successfully",
  "timestamp": "2024-04-10T11:05:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Location not found",
  "error": "Not Found"
}
```

---

## Train Schedule Endpoints

### Up-Line Train Schedules

#### 1. Create Up-Line Schedule

**Endpoint:** `POST /location/up-train-schedule`

**Description:** Create train schedule for up-line (direction 1).

**Authentication:** Required (Admin required)

**Request Body:**
```json
{
  "locationId": 1,
  "departureTime": "08:30:00",
  "arrivalTime": "08:45:00",
  "trainNumber": "UP-001"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "locationId": 1,
  "departureTime": "08:30:00",
  "arrivalTime": "08:45:00",
  "trainNumber": "UP-001",
  "createdAt": "2024-04-10T11:10:00.000Z",
  "updatedAt": "2024-04-10T11:10:00.000Z"
}
```

---

#### 2. Get All Up-Line Schedules

**Endpoint:** `GET /location/up-train-schedule`

**Description:** Retrieve all up-line train schedules.

**Authentication:** Optional

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "locationId": 1,
    "departureTime": "08:30:00",
    "arrivalTime": "08:45:00",
    "trainNumber": "UP-001",
    "createdAt": "2024-04-10T11:10:00.000Z",
    "updatedAt": "2024-04-10T11:10:00.000Z"
  },
  {
    "id": 2,
    "locationId": 1,
    "departureTime": "09:00:00",
    "arrivalTime": "09:15:00",
    "trainNumber": "UP-002",
    "createdAt": "2024-04-10T11:15:00.000Z",
    "updatedAt": "2024-04-10T11:15:00.000Z"
  }
]
```

---

#### 3. Get Specific Up-Line Schedule

**Endpoint:** `GET /location/up-train-schedule/:id`

**Description:** Retrieve specific up-line schedule by ID.

**Authentication:** Optional

**Response (200 OK):**
```json
{
  "id": 1,
  "locationId": 1,
  "departureTime": "08:30:00",
  "arrivalTime": "08:45:00",
  "trainNumber": "UP-001",
  "createdAt": "2024-04-10T11:10:00.000Z",
  "updatedAt": "2024-04-10T11:10:00.000Z"
}
```

---

#### 4. Update Up-Line Schedule

**Endpoint:** `PUT /location/up-train-schedule/:id`

**Description:** Update existing up-line schedule.

**Authentication:** Required (Admin required)

**Request Body:**
```json
{
  "departureTime": "08:35:00",
  "arrivalTime": "08:50:00",
  "trainNumber": "UP-001-REVISED"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "locationId": 1,
  "departureTime": "08:35:00",
  "arrivalTime": "08:50:00",
  "trainNumber": "UP-001-REVISED",
  "createdAt": "2024-04-10T11:10:00.000Z",
  "updatedAt": "2024-04-10T11:20:00.000Z"
}
```

---

#### 5. Delete Up-Line Schedule

**Endpoint:** `DELETE /location/up-train-schedule/:id`

**Description:** Remove up-line schedule.

**Authentication:** Required (Admin required)

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Schedule deleted successfully"
}
```

---

### Down-Line Train Schedules

Same endpoints as up-line, but for down-line direction:
- `POST /location/down-train-schedule`
- `GET /location/down-train-schedule`
- `GET /location/down-train-schedule/:id`
- `PUT /location/down-train-schedule/:id`
- `DELETE /location/down-train-schedule/:id`

Request/response structure identical to up-line schedules.

---

## Journey Endpoints

### 1. Create Journey

**Endpoint:** `POST /journey/create`

**Description:** Create a new journey record.

**Authentication:** Required

**Request Body:**
```json
{
  "userId": 1,
  "startLocationId": 1,
  "endLocationId": 3,
  "startTime": "2024-04-10T08:30:00"
}
```

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "message": "Journey created successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "startLocationId": 1,
    "endLocationId": 3,
    "startTime": "2024-04-10T08:30:00.000Z",
    "endTime": null,
    "status": "created",
    "fare": null,
    "createdAt": "2024-04-10T11:25:00.000Z",
    "updatedAt": "2024-04-10T11:25:00.000Z"
  }
}
```

---

### 2. Start Journey

**Endpoint:** `POST /journey/start`

**Description:** Mark a journey as started and active.

**Authentication:** Required

**Request Body:**
```json
{
  "journeyId": 1,
  "userId": 1
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Journey started successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "startLocationId": 1,
    "endLocationId": 3,
    "startTime": "2024-04-10T08:30:00.000Z",
    "status": "started",
    "createdAt": "2024-04-10T11:25:00.000Z",
    "updatedAt": "2024-04-10T11:30:00.000Z"
  }
}
```

---

### 3. End Journey

**Endpoint:** `POST /journey/end`

**Description:** Complete a journey and calculate fare.

**Authentication:** Required

**Request Body:**
```json
{
  "journeyId": 1,
  "userId": 1,
  "endTime": "2024-04-10T09:00:00"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Journey ended successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "startLocationId": 1,
    "endLocationId": 3,
    "startTime": "2024-04-10T08:30:00.000Z",
    "endTime": "2024-04-10T09:00:00.000Z",
    "status": "completed",
    "duration": "30 minutes",
    "fare": 50.00,
    "createdAt": "2024-04-10T11:25:00.000Z",
    "updatedAt": "2024-04-10T11:35:00.000Z"
  }
}
```

---

### 4. Get Monthly Summary

**Endpoint:** `GET /journey/monthly-summary`

**Description:** Get user's journey summary for specific month.

**Authentication:** Required

**Query Parameters:**
```json
{
  "userId": 1,
  "month": 4,
  "year": 2024
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "userId": 1,
  "month": 4,
  "year": 2024,
  "summary": {
    "totalJourneys": 22,
    "completedJourneys": 20,
    "totalDistance": 156.5,
    "totalDuration": "22 hours 30 minutes",
    "totalFare": 1100.00,
    "averageFarePerJourney": 50.00,
    "averageDurationPerJourney": "67 minutes"
  },
  "journeys": [
    {
      "id": 1,
      "startLocationId": 1,
      "endLocationId": 3,
      "startTime": "2024-04-01T08:30:00.000Z",
      "endTime": "2024-04-01T09:00:00.000Z",
      "fare": 50.00
    }
  ],
  "timestamp": "2024-04-10T11:40:00.000Z"
}
```

**Alternative Format (POST method):**
```bash
curl -X GET "http://localhost:3000/journey/monthly-summary?month=4&year=2024" \
  -H "Authorization: Bearer <token>"
```

---

## Admin Endpoints

### 1. Set Service Time

**Endpoint:** `POST /admin/set-service-time`

**Description:** Set metro service operating hours.

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "startTime": "06:00:00",
  "endTime": "23:00:00"
}
```

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "message": "Service time set successfully",
  "data": {
    "id": 1,
    "startTime": "06:00:00",
    "endTime": "23:00:00",
    "createdAt": "2024-04-10T11:45:00.000Z",
    "updatedAt": "2024-04-10T11:45:00.000Z"
  }
}
```

---

### 2. Get Service Time

**Endpoint:** `GET /admin/get-service-time`

**Description:** Retrieve current service operating hours.

**Authentication:** Optional

**Response (200 OK):**
```json
{
  "id": 1,
  "startTime": "06:00:00",
  "endTime": "23:00:00",
  "createdAt": "2024-04-10T11:45:00.000Z",
  "updatedAt": "2024-04-10T11:45:00.000Z"
}
```

---

### 3. Update Service Time

**Endpoint:** `PUT /admin/update-service-time`

**Description:** Update service operating hours.

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "startTime": "05:30:00",
  "endTime": "23:30:00"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "startTime": "05:30:00",
  "endTime": "23:30:00",
  "createdAt": "2024-04-10T11:45:00.000Z",
  "updatedAt": "2024-04-10T11:50:00.000Z"
}
```

---

### 4. Get All Admin Locations

**Endpoint:** `GET /admin/locations`

**Description:** Admin view of all locations.

**Authentication:** Required (Admin only)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Central Station",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "description": "Main station",
    "createdAt": "2024-04-10T10:50:00.000Z",
    "updatedAt": "2024-04-10T10:50:00.000Z"
  }
]
```

---

### 5. Get Location by ID (Admin)

**Endpoint:** `GET /admin/location/:id`

**Description:** Admin view of specific location.

**Authentication:** Required (Admin only)

**Response:** Same as public endpoint

---

### 6. Update Location (Admin)

**Endpoint:** `PUT /admin/location/:id`

**Description:** Admin update location.

**Authentication:** Required (Admin only)

**Request/Response:** Same as public endpoint

---

### 7. Delete Location (Admin)

**Endpoint:** `DELETE /admin/location/:id`

**Description:** Admin delete location.

**Authentication:** Required (Admin only)

**Response:** Same as public endpoint

---

## Error Responses

### Common Error Format

```json
{
  "statusCode": 400,
  "message": "Error message describing the issue",
  "error": "Bad Request",
  "timestamp": "2024-04-10T11:55:00.000Z",
  "path": "/endpoint"
}
```

### Standard Error Codes

| Status | Error | Common Causes |
|--------|-------|-----------------|
| 400 | Bad Request | Invalid input, missing required fields |
| 401 | Unauthorized | Missing/invalid token, token expired |
| 403 | Forbidden | Insufficient permissions (not admin) |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email, duplicate entry |
| 500 | Internal Server Error | Database/server error |

### Specific Error Messages

**Invalid Email Format**
```json
{
  "statusCode": 400,
  "message": "Email must be a valid email address",
  "error": "Bad Request"
}
```

**Password Too Short**
```json
{
  "statusCode": 400,
  "message": "Password must be at least 8 characters long",
  "error": "Bad Request"
}
```

**Authentication Failed**
```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

**Token Expired**
```json
{
  "statusCode": 401,
  "message": "Token expired",
  "error": "Unauthorized"
}
```

**Admin Only**
```json
{
  "statusCode": 403,
  "message": "Only administrators can access this resource",
  "error": "Forbidden"
}
```

---

## Rate Limiting

### Recommended Limits (To Be Implemented)

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login/OTP | 5 attempts | 15 minutes |
| Signup | 3 per IP | 1 hour |
| General API | 100 requests | 1 minute |

### Implementation Usage

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1712753700
```

**Response When Limit Exceeded (429 Too Many Requests):**
```json
{
  "statusCode": 429,
  "message": "Too many requests, please try again later",
  "error": "Too Many Requests",
  "retryAfter": 60
}
```

---

## Testing Endpoints with Postman

### Setup
1. Create Postman collection
2. Add base URL as variable: `{{baseUrl}}`
3. Add token as variable: `{{token}}`

### Example Test Sequence

**1. Sign Up**
```
POST {{baseUrl}}/user/signUp
Body: { email, password, phone }
```

**2. Confirm Registration**
```
POST {{baseUrl}}/user/signUpConfirmation
Body: { email, otp }
```

**3. Login**
```
POST {{baseUrl}}/user/login
Body: { email, password }
```

**4. Confirm Login (Get Token)**
```
POST {{baseUrl}}/user/loginConfirmation
Body: { email, otp }
Save token to {{token}}
```

**5. Protected Request**
```
GET {{baseUrl}}/journey/monthly-summary
Header: Authorization: Bearer {{token}}
```

---

**Document Version:** 1.0  
**Last Updated:** April 2026  
**Status:** Complete Reference
