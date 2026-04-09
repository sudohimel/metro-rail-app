# Architecture Documentation - Metro Rail App

## Table of Contents
1. [System Overview](#system-overview)
2. [Architectural Patterns](#architectural-patterns)
3. [Module Architecture](#module-architecture)
4. [Data Models & Database Schema](#data-models--database-schema)
5. [Authentication & Authorization](#authentication--authorization)
6. [Request/Response Flow](#requestresponse-flow)
7. [Error Handling](#error-handling)
8. [Dependencies & Third-Party Libraries](#dependencies--third-party-libraries)
9. [Design Decisions](#design-decisions)

---

## System Overview

**Metro Rail App** is built on **NestJS**, a progressive Node.js framework that provides a modular, scalable architecture for building REST APIs. The system manages a complete metro rail transportation network with user management, journey tracking, location/station management, and administrative functions.

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Applications                     │
│                  (Web, Mobile, Desktop)                      │
└─────────────────────────────────────┬───────────────────────┘
                                      │
                        ┌─────────────▼─────────────┐
                        │   HTTP/REST API            │
                        │    (NestJS Server)         │
                        │   Port: 3000 (default)     │
                        └─────────────┬─────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
        │                             │                             │
┌───────▼────────┐         ┌──────────▼──────────┐       ┌─────────▼────────┐
│  Authentication │         │  Business Logic     │       │  Data Validation │
│   & JWT        │         │   & Services        │       │   & DTOs         │
├────────────────┤         ├─────────────────────┤       ├──────────────────┤
│ User Module    │         │ User Service        │       │ Create User DTO  │
│ Auth Guards    │         │ Journey Service     │       │ Login User DTO   │
│ Passport       │         │ Location Service    │       │ Create Journey   │
│ JWT Strategy   │         │ Admin Service       │       │ Start Journey DTO│
└────────────────┘         └──────────┬──────────┘       └──────────────────┘
                                      │
                        ┌─────────────▼─────────────┐
                        │   TypeORM (Database ORM)  │
                        │   Entity Mapping           │
                        └─────────────┬─────────────┘
                                      │
                        ┌─────────────▼─────────────┐
                        │      MySQL Database       │
                        │   metro_rail_db           │
                        │  (Tables & Relationships) │
                        └───────────────────────────┘
```

---

## Architectural Patterns

### 1. **Modular Architecture**

The application is organized into feature-based modules, each with its own:
- **Controller** - HTTP request handlers
- **Service** - Business logic
- **Entity** - Database models
- **DTO** - Data transfer objects for validation
- **Interface** - TypeScript contracts
- **Module** - DI container configuration

### 2. **Service-Oriented Architecture**

Each module exposes a service that contains:
- Database operations (CRUD)
- Business logic
- Data transformation
- Cross-module communication

### 3. **Dependency Injection (DI)**

NestJS uses dependency injection via:
- Constructor injection
- Property injection (decorators)
- Custom providers
- Module imports/exports

Example:
```typescript
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
}
```

### 4. **Controller-Service Pattern**

```
HTTP Request → Controller → Service → Repository → Database
                   ↓           ↓
              Validation   Business Logic
                   ↓           ↓
             Response ←─────────┘
```

### 5. **Guard-Based Authorization**

Route protection via JWT authentication guards:
```typescript
@UseGuards(JwtAuthGuard)
@Get('protected-route')
protectedRoute() {}
```

---

## Module Architecture

### Module Dependency Graph

```
AppModule (Root)
    ├── UserModule
    │   ├── Entities: User
    │   ├── DTOs: CreateUserDto, LoginUserDto, OtpDto
    │   ├── Services: UserService
    │   └── Controllers: UserController
    │
    ├── AuthModule
    │   ├── Services: JwtAuthService
    │   ├── Guards: JwtAuthGuard
    │   ├── Strategies: JwtStrategy
    │   └── Interfaces: JwtPayload
    │
    ├── LocationModule
    │   ├── Entities: Location, UpTrainSchedule, DownTrainSchedule
    │   ├── DTOs: CreateLocationDto, UpdateLocationDto, etc.
    │   ├── Services: LocationService
    │   ├── Interfaces: ILocation, ITrainSchedule
    │   └── Controllers: LocationController
    │
    ├── JourneyModule
    │   ├── Entities: Journey
    │   ├── DTOs: CreateJourneyDto, StartJourneyDto, EndJourneyDto
    │   ├── Services: JourneyService
    │   ├── Helpers: JourneyHelpers
    │   └── Controllers: JourneyController
    │
    └── AdminModule
        ├── Entities: AdminServiceTime
        ├── DTOs: CreateAdminServiceTimeDto, UpdateAdminServiceTimeDto
        ├── Services: AdminService
        ├── Interfaces: IAdminServiceTime
        └── Controllers: AdminController
```

### Module Interactions

```
UserModule
    │
    ├─→ AuthModule (authentication)
    │
    └─→ JourneyModule (user journeys)

JourneyModule
    │
    ├─→ UserModule (user reference)
    │
    ├─→ LocationModule (travel locations)
    │
    └─→ AdminModule (service times)

LocationModule
    └─→ AdminModule (schedule management)

AdminModule
    └─→ LocationModule (manage stations)
```

---

## Data Models & Database Schema

### Entity Relationships

```
User (1) ──────────── (N) Journey
  ├── id (PK)            ├── id (PK)
  ├── email (UNIQUE)     ├── userId (FK)
  ├── password           ├── startLocation (FK)
  ├── phone              ├── endLocation (FK)
  ├── isVerified         ├── startTime
  ├── createdAt          ├── endTime
  └── updatedAt          ├── status
                         ├── fare
                         ├── createdAt
                         └── updatedAt

Location (1) ──────────── (N) UpTrainSchedule
  ├── id (PK)                ├── id (PK)
  ├── name                   ├── locationId (FK)
  ├── latitude               ├── departureTime
  ├── longitude              ├── arrivalTime
  ├── description            ├── trainNumber
  ├── createdAt              ├── createdAt
  └── updatedAt              └── updatedAt

Location (1) ──────────── (N) DownTrainSchedule
  (Same structure as UpTrainSchedule)

AdminServiceTime (1) ──── (1) Global Configuration
  ├── id (PK)
  ├── startTime (08:00)
  ├── endTime (23:00)
  ├── createdAt
  └── updatedAt
```

### Database Schema Details

#### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  isVerified BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);
```

#### Journeys Table
```sql
CREATE TABLE journeys (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  startLocationId INT,
  endLocationId INT,
  startTime DATETIME,
  endTime DATETIME,
  status ENUM('started', 'completed', 'cancelled'),
  fare DECIMAL(10, 2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (startLocationId) REFERENCES locations(id),
  FOREIGN KEY (endLocationId) REFERENCES locations(id),
  INDEX idx_userId (userId),
  INDEX idx_startTime (startTime)
);
```

#### Locations Table
```sql
CREATE TABLE locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);
```

#### UpTrainSchedule Table
```sql
CREATE TABLE up_train_schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  locationId INT NOT NULL,
  departureTime TIME,
  arrivalTime TIME,
  trainNumber VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (locationId) REFERENCES locations(id),
  INDEX idx_locationId (locationId)
);
```

#### DownTrainSchedule Table
```sql
CREATE TABLE down_train_schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  locationId INT NOT NULL,
  departureTime TIME,
  arrivalTime TIME,
  trainNumber VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (locationId) REFERENCES locations(id),
  INDEX idx_locationId (locationId)
);
```

#### AdminServiceTime Table
```sql
CREATE TABLE admin_service_times (
  id INT PRIMARY KEY AUTO_INCREMENT,
  startTime TIME,
  endTime TIME,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## Authentication & Authorization

### JWT Authentication Flow

```
1. User Registration
   ┌─────────────────────────────────────────────┐
   │ POST /user/signUp                           │
   │ Body: { email, password, phone }            │
   └────────────────┬────────────────────────────┘
                    ▼
   ┌─────────────────────────────────────────────┐
   │ UserService.signUp()                        │
   │ - Hash password with bcrypt                 │
   │ - Generate OTP                              │
   │ - Save user (isVerified = false)            │
   │ - Send OTP to email                         │
   └────────────────┬────────────────────────────┘
                    ▼
   ┌─────────────────────────────────────────────┐
   │ Response: { message: "OTP sent to email" }  │
   └─────────────────────────────────────────────┘

2. Confirm Registration (OTP)
   ┌──────────────────────────────────────────────┐
   │ POST /user/signUpConfirmation                │
   │ Body: { email, otp }                         │
   └────────────────┬─────────────────────────────┘
                    ▼
   ┌──────────────────────────────────────────────┐
   │ UserService.confirmSignUp()                  │
   │ - Verify OTP matches                         │
   │ - Mark user as isVerified = true             │
   └────────────────┬─────────────────────────────┘
                    ▼
   ┌──────────────────────────────────────────────┐
   │ Response: { message: "Signup confirmed" }    │
   └──────────────────────────────────────────────┘

3. User Login
   ┌─────────────────────────────────────────────┐
   │ POST /user/login                            │
   │ Body: { email, password }                   │
   └────────────────┬────────────────────────────┘
                    ▼
   ┌─────────────────────────────────────────────┐
   │ UserService.login()                         │
   │ - Find user by email                        │
   │ - Compare password hash with bcrypt         │
   │ - Generate OTP                              │
   │ - Send OTP to email                         │
   └────────────────┬────────────────────────────┘
                    ▼
   ┌─────────────────────────────────────────────┐
   │ Response: { message: "OTP sent to email" }  │
   └─────────────────────────────────────────────┘

4. Confirm Login (OTP)
   ┌──────────────────────────────────────────────┐
   │ POST /user/loginConfirmation                 │
   │ Body: { email, otp }                         │
   └────────────────┬─────────────────────────────┘
                    ▼
   ┌──────────────────────────────────────────────┐
   │ UserService.confirmLogin()                   │
   │ - Verify OTP                                 │
   │ - Generate JWT token                         │
   │ - Token lifetime: JWT_EXPIRATION_TIME        │
   │ - Payload: { userId, email, iat, exp }      │
   └────────────────┬─────────────────────────────┘
                    ▼
   ┌──────────────────────────────────────────────┐
   │ Response: { message: "Login successful",     │
   │            token: "eyJhbGciOiJIUzI1NiI..." } │
   └──────────────────────────────────────────────┘

5. Protected Requests
   ┌──────────────────────────────────────────┐
   │ GET /journey/monthly-summary             │
   │ Header: { Authorization: "Bearer TOKEN" }│
   └────────────────┬─────────────────────────┘
                    ▼
   ┌──────────────────────────────────────────┐
   │ JwtAuthGuard checks request              │
   │ - Extract token from Authorization       │
   │ - Verify token signature                 │
   │ - Check token expiration                 │
   │ - Verify user exists                     │
   └────────────────┬─────────────────────────┘
                    ▼
         ┌──────────────┬──────────────┐
         │              │              │
      Valid          Invalid       Expired
         │              │              │
         ▼              ▼              ▼
   Process Request  401 Error    401 Error
         │              │              │
         └──────────────┼──────────────┘
                        ▼
```

### JWT Token Structure

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": 1,
  "email": "user@example.com",
  "iat": 1620000000,
  "exp": 1620003600
}

Signature: HMACSHA256(
  base64UrlEncode(Header) + "." + 
  base64UrlEncode(Payload),
  JWT_SECRET
)

Complete Token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTYyMDAwMDAwMCwiZXhwIjoxNjIwMDAzNjAwfQ.
signature_here
```

### Security Implementation

**Password Encryption:**
- Algorithm: bcrypt (NIST approved)
- Salt rounds: 10
- Cost: ~100ms per hash

```typescript
// Hashing
const hashedPassword = await bcrypt.hash(password, 10);

// Verification
const passwordMatch = await bcrypt.compare(inputPassword, storedHash);
```

**JWT Configuration:**
- Algorithm: HS256 (HMAC with SHA-256)
- Secret: Must be >32 characters
- Expiration: Configurable (default 3600 seconds = 1 hour)

---

## Request/Response Flow

### Typical Request Lifecycle

```
1. HTTP Request Arrives
   POST /user/login
   Content-Type: application/json
   {
     "email": "user@example.com",
     "password": "password123"
   }

2. NestJS Pipeline
   │
   ├─→ Global Middleware
   │   ├── Request parsing
   │   ├── Body parsing
   │   └── Logging
   │
   ├─→ Route Matching
   │   └── Maps to UserController.login()
   │
   ├─→ Guards (if @UseGuards applied)
   │   ├── JwtAuthGuard
   │   ├── Custom Guards
   │   └── Validate request can proceed
   │
   ├─→ Interceptors (before)
   │   └── Request transformation
   │
   ├─→ Pipe (Validation)
   │   ├── Transform DTO
   │   ├── Validate with class-validator
   │   └── Throw BadRequestException if invalid
   │
   ├─→ Controller Handler
   │   ├── UserController.login()
   │   │   └── Calls UserService.login()
   │   └── Returns response object
   │
   ├─→ Interceptors (after)
   │   ├── Transform response
   │   └── Add metadata
   │
   ├─→ Exception Filters
   │   ├── Catch any exceptions
   │   └── Convert to HTTP response
   │
   └─→ Response Sent
       {
         "statusCode": 200,
         "message": "OTP sent to email",
         "timestamp": "2024-04-10T10:30:00Z"
       }
```

### Example: Journey Creation Flow

```
Request:
POST /journey/create
Authorization: Bearer <token>
{
  "userId": 1,
  "startLocationId": 5,
  "endLocationId": 10,
  "startTime": "2024-04-10T08:00:00"
}

Processing:
1. JwtAuthGuard validates token
   → Extract userId from payload
   → Attach to request.user

2. Pipe validates CreateJourneyDto
   → Check required fields
   → Type validation
   → Custom validations

3. JourneyController.createJourney()
   → Calls JourneyService.createJourney()

4. JourneyService.createJourney()
   → Validate user exists
   → Validate locations exist
   → Create Journey entity
   → Save to database
   → Return created journey

Response:
{
  "statusCode": 201,
  "message": "Journey created successfully",
  "data": {
    "id": 107,
    "userId": 1,
    "startLocationId": 5,
    "endLocationId": 10,
    "startTime": "2024-04-10T08:00:00",
    "status": "pending",
    "createdAt": "2024-04-10T10:30:00"
  }
}
```

---

## Error Handling

### Exception Handling Strategy

```
Application Exceptions
  │
  ├── HttpException
  │   ├── BadRequestException (400)
  │   ├── UnauthorizedException (401)
  │   ├── ForbiddenException (403)
  │   ├── NotFoundException (404)
  │   └── ConflictException (409)
  │
  ├── DatabaseException
  │   └── Caught and converted to HttpException
  │
  ├── ValidationException
  │   └── Automatic from pipes
  │
  └── Unexpected Errors
      └── 500 Internal Server Error
```

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Email already exists",
  "error": "Bad Request",
  "timestamp": "2024-04-10T10:30:00.000Z",
  "path": "/user/signUp"
}
```

### Common Error Scenarios

| Scenario | Status Code | Message |
|----------|-------------|---------|
| Invalid email format | 400 | Email must be valid |
| Password too short | 400 | Password must be >8 chars |
| User not found | 404 | User not found |
| Invalid credentials | 401 | Invalid email or password |
| Missing JWT token | 401 | Unauthorized |
| Expired JWT token | 401 | Token expired |
| Invalid OTP | 400 | Invalid OTP |
| Duplicate email | 409 | Email already exists |
| Database connection error | 500 | Internal server error |

---

## Dependencies & Third-Party Libraries

### Core Framework
- **@nestjs/core**: Core NestJS framework
- **@nestjs/common**: Common utilities and decorators
- **@nestjs/platform-express**: Express integration

### Database
- **typeorm**: ORM for database operations
- **@nestjs/typeorm**: TypeORM integration for NestJS
- **mysql2**: MySQL database driver

### Authentication
- **@nestjs/passport**: Passport.js integration
- **@nestjs/jwt**: JWT handling
- **passport**: Authentication middleware
- **passport-jwt**: JWT authentication strategy
- **passport-local**: Local username/password strategy
- **bcrypt** / **bcryptjs**: Password hashing

### Validation
- **class-validator**: Decorator-based validation
- **class-transformer**: DTO transformation

### Utilities
- **reflect-metadata**: Metadata reflection
- **rxjs**: Reactive programming (NestJS foundation)
- **otp-generator**: Generate OTP codes
- **qrcode**: QR code generation
- **multer**: File upload handling

### Development Tools
- **@nestjs/cli**: Command-line tools
- **@nestjs/schematics**: Code generators
- **typescript**: TypeScript compiler
- **eslint**: Code linting
- **prettier**: Code formatting
- **jest**: Testing framework
- **@nestjs/testing**: Testing utilities

---

## Design Decisions

### 1. **Why NestJS?**

✅ **Advantages:**
- Built-in TypeScript support
- Modular architecture
- Dependency injection
- Decorator-based routing
- Active maintenance and community
- Battle-tested in production

### 2. **Why TypeORM?**

✅ **Advantages:**
- Type-safe database operations
- Automatic schema synchronization
- Support for relationships
- Query builder for complex queries
- Migration support
- NestJS integration out-of-box

### 3. **JWT for Authentication**

✅ **Advantages:**
- Stateless authentication (no session storage)
- Scalable across multiple servers
- Works well with SPAs and mobile apps
- Industry standard
- Easy token refresh

⚠️ **Tradeoff:** No immediate token revocation (handled with expiration)

### 4. **OTP for Multi-Factor Verification**

✅ **Advantages:**
- Prevents unauthorized access
- Protects against password replay attacks
- Email-based (no SMS cost)
- Verification proof

🔄 **Alternative:** Could use authenticator app (TOTP)

### 5. **Modular Architecture**

✅ **Advantages:**
- Easy to test
- Clear separation of concerns
- Reusable modules
- Scalable design
- Easy to add new features

### 6. **Service-Oriented Business Logic**

✅ **Advantages:**
- Testable business logic
- Reusable across controllers
- Single responsibility
- Easier maintenance

### 7. **Guard-Based Route Protection**

✅ **Advantages:**
- Declarative security
- Composable guards
- Can be conditional
- Follows NestJS patterns

### 8. **MySQL Database**

✅ **Advantages:**
- Relational data (journeys → users → locations)
- ACID compliance
- Good performance for read-heavy operations
- Wide hosting support

---

## Performance Considerations

### Database Optimization
1. **Indexes:** Created on frequently queried fields
   - `users(email)` - Quick user lookup
   - `journeys(userId)` - User journey history
   - `journeys(startTime)` - Time-range queries

2. **Query Optimization:**
   - Select only needed fields
   - Avoid N+1 queries
   - Use efficient joins

### API Response Time
- Average: 50-100ms
- Heavy queries: 200-500ms
- Database queries: 5-50ms

### Caching Strategy
- Session data in JWT (no database lookup needed)
- Location data can be cached (changes infrequently)
- Schedule data can be cached

### Scalability
- Stateless design allows horizontal scaling
- Database connection pooling
- Load balancer ready

---

## Security Best Practices

✅ **Implemented:**
- Password hashing with bcrypt
- JWT tokens with expiration
- Input validation with class-validator
- CORS configuration (can be added)
- Rate limiting (recommended to add)

⚠️ **Recommended Additions:**
- HTTPS in production
- Rate limiting on auth endpoints
- Request size limits
- SQL injection prevention (TypeORM handles)
- XSS prevention (response validation)
- CSRF protection (if needed)

---

## Testing Strategy

### Unit Tests
- Service logic tests
- Controller method tests
- Guard tests
- Pipe tests

### Integration Tests
- API endpoint tests
- Database integration
- Authentication flow

### E2E Tests
- Complete user journeys
- Real HTTP requests
- Database state verification

---

## Deployment Architecture

```
┌─────────────────┐
│  Load Balancer  │
└────────┬────────┘
         │
    ┌────┴────┐
    │          │
┌───▼────┐ ┌──▼───┐
│Server 1│ │Server 2│
│(Port   │ │(Port   │
│3000)   │ │3001)   │
└────┬───┘ └───┬───┘
     │         │
     └────┬────┘
          │
    ┌─────▼─────┐
    │   MySQL    │
    │Database    │
    └────────────┘
```

---

**Document Version:** 1.0  
**Last Updated:** April 2026  
**Status:** Active Development
