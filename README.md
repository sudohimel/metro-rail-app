# Metro Rail App - Backend API

<div align="center">

[![NestJS](https://img.shields.io/badge/NestJS-v10.0.0-ea2845?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.x-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-68a063?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-v5.7+-4479a1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-UNLICENSED-red?style=flat-square)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square)](https://github.com/sudohimel/metro-rail-app)

</div>

A sophisticated, scalable **NestJS-based backend API** for a comprehensive metro rail/transportation management system. Built with enterprise-grade architecture, the Metro Rail App handles user authentication, journey tracking, location management, and administrator functions for modern urban transit systems.

## 🚀 Overview

**Metro Rail App** is a full-featured REST API designed to manage every aspect of a metro rail transportation network. From user registration with OTP verification to real-time journey tracking and administrative configuration, this system provides a robust foundation for transport management platforms.

### Key Features

✅ **User Management**
- Secure registration with OTP-based email verification
- JWT-based authentication and authorization
- Login confirmation with multi-factor verification
- Role-based access control (Users & Admins)

✅ **Journey Management**
- Create, start, and end journeys with timestamps
- Real-time journey duration tracking
- Monthly journey summaries and analytics
- Journey history and fare calculations

✅ **Location Management**
- Manage metro stations/locations
- Train schedule management (Up-line and Down-line)
- Station-specific arrival/departure times
- Schedule updates and modifications

✅ **Admin Functions**
- Set metro service operating times
- Configure operating hours flexibility
- Bulk location and schedule management
- Monitor system-wide journey data

✅ **Security & Reliability**
- Industry-standard JWT token-based authentication
- Password encryption with bcrypt and bcryptjs
- Comprehensive input validation
- Error handling and graceful failure management

## 📋 Tech Stack

**Backend Framework**
- **NestJS** v10.0.0 - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **Node.js** - JavaScript runtime

**Database**
- **MySQL** v3.11.4 - Relational database
- **TypeORM** v0.3.20 - ORM for database operations

**Authentication & Security**
- **JWT (JSON Web Tokens)** - Authentication tokens
- **Passport.js** - Authentication middleware
- **bcrypt** - Password hashing
- **bcryptjs** - Additional password security

**Utilities**
- **OTP Generator** - One-time passwords for verification
- **QR Code** - QR code generation for features
- **Class Validator** - Input validation
- **Multer** - File upload handling

**Development Tools**
- **ESLint** - Code quality linting
- **Prettier** - Code formatting
- **Jest** - Unit and integration testing
- **Supertest** - HTTP assertion library

## 📁 Project Structure

```
metro-rail-app/
├── src/
│   ├── admin/                          # Admin management module
│   │   ├── entities/                   # Admin database entities
│   │   ├── dto/                        # Data Transfer Objects
│   │   ├── admin.controller.ts         # Request handlers
│   │   ├── admin.service.ts            # Business logic
│   │   ├── admin.module.ts             # Module definition
│   │   └── admin.interface.ts          # TypeScript interfaces
│   │
│   ├── user/                           # User authentication & management
│   │   ├── entities/                   # User database entities
│   │   ├── dto/                        # Registration, login DTOs
│   │   ├── interface/                  # User interfaces
│   │   ├── user.controller.ts          # Authentication endpoints
│   │   ├── user.service.ts             # Auth business logic
│   │   └── user.module.ts              # Module definition
│   │
│   ├── auth/                           # JWT authentication strategy
│   │   ├── jwt-auth.guard.ts           # JWT route protection
│   │   ├── jwt-auth.service.ts         # JWT token operations
│   │   ├── jwt.strategy.ts             # Passport JWT strategy
│   │   └── jwt-payload.interface.ts    # JWT payload structure
│   │
│   ├── journey/                        # Journey tracking module
│   │   ├── entities/                   # Journey database entities
│   │   ├── dto/                        # Journey DTOs
│   │   ├── interface/                  # Journey interfaces
│   │   ├── journey.controller.ts       # Journey endpoints
│   │   ├── journey.service.ts          # Journey business logic
│   │   ├── journey.helpers.ts          # Utility functions
│   │   └── journey.module.ts           # Module definition
│   │
│   ├── location/                       # Station/location management
│   │   ├── entities/                   # Location & schedule entities
│   │   ├── dto/                        # Location and schedule DTOs
│   │   ├── location.interface.ts       # Location interfaces
│   │   ├── location.controller.ts      # Location/schedule endpoints
│   │   ├── location.service.ts         # Location business logic
│   │   └── location.module.ts          # Module definition
│   │
│   ├── app.module.ts                   # Root application module
│   ├── app.controller.ts               # Root controller
│   ├── app.service.ts                  # Root service
│   └── main.ts                         # Application entry point
│
├── test/                               # Test files
│   └── jest-e2e.json                   # E2E test configuration
│
├── dist/                               # Compiled JavaScript output
├── node_modules/                       # Dependencies
├── package.json                        # Project metadata & dependencies
├── package-lock.json                   # Dependency lock file
├── tsconfig.json                       # TypeScript configuration
├── tsconfig.build.json                 # Build TypeScript config
├── nest-cli.json                       # NestJS CLI configuration
├── .env                                # Environment variables (not in repo)
├── .env.example                        # Environment template (in repo)
├── .gitignore                          # Git ignore rules
├── .eslintrc.js                        # ESLint configuration
├── .prettierrc                         # Prettier formatting config
└── README.md                           # This file
```

## 🔧 Installation & Setup

### Prerequisites

- **Node.js** v16.x or higher
- **npm** or **yarn** package manager
- **MySQL** v5.7 or higher running locally
- **Git** for version control

### Step 1: Clone Repository

```bash
git clone https://github.com/sudohimel/metro-rail-app.git
cd metro-rail-app
```

### Step 2: Install Dependencies

Using **yarn** (recommended):
```bash
yarn install
```

Or using **npm**:
```bash
npm install
```

### Step 3: Configure Environment

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION_TIME=3600

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your-db-password
DB_NAME=metro_rail_db

# Application Configuration
NODE_ENV=development
PORT=3000
```

### Step 4: Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE metro_rail_db;
USE metro_rail_db;
```

The TypeORM will automatically synchronize tables with entities.

### Step 5: Start Development Server

```bash
yarn start:dev
```

Server will start at `http://localhost:3000`

## 🚀 Running the Application

### Development Mode (with auto-reload)
```bash
yarn start:dev
```

### Production Mode
```bash
yarn build
yarn start:prod
```

### Debug Mode
```bash
yarn start:debug
```

## 🧪 Testing

### Run Unit & Integration Tests
```bash
yarn test
```

### Run Tests in Watch Mode
```bash
yarn test:watch
```

### Run Tests with Coverage
```bash
yarn test:cov
```

### Run E2E Tests
```bash
yarn test:e2e
```

## 📝 Code Quality

### Format Code
```bash
yarn format
```

### Lint Code
```bash
yarn lint
```

### Fix Linting Issues
```bash
yarn lint --fix
```

## 📡 API Endpoints

### User Authentication
- `POST /user/signUp` - Register new user
- `POST /user/signUpConfirmation` - Confirm registration with OTP
- `POST /user/login` - Login user
- `POST /user/loginConfirmation` - Confirm login with OTP

### Location Management
- `POST /location/location` - Create new station
- `GET /location/location` - Get all stations
- `GET /location/location/:id` - Get station by ID
- `PUT /location/location/:id` - Update station
- `DELETE /location/location/:id` - Delete station

### Train Schedules
- `POST /location/up-train-schedule` - Create up-line schedule
- `GET /location/up-train-schedule` - Get all up-line schedules
- `GET /location/up-train-schedule/:id` - Get specific schedule
- `PUT /location/up-train-schedule/:id` - Update schedule
- `DELETE /location/up-train-schedule/:id` - Delete schedule

- `POST /location/down-train-schedule` - Create down-line schedule
- `GET /location/down-train-schedule` - Get all down-line schedules
- `GET /location/down-train-schedule/:id` - Get specific schedule
- `PUT /location/down-train-schedule/:id` - Update schedule
- `DELETE /location/down-train-schedule/:id` - Delete schedule

### Journey Management
- `POST /journey/create` - Create journey
- `POST /journey/start` - Start journey
- `POST /journey/end` - End journey
- `GET /journey/monthly-summary` - Get monthly journey summary

### Admin Functions
- `POST /admin/set-service-time` - Set operating hours
- `GET /admin/get-service-time` - Get current operating hours
- `PUT /admin/update-service-time` - Update operating hours
- `GET /admin/locations` - Get all locations
- `GET /admin/location/:id` - Get location by ID
- `PUT /admin/location/:id` - Update location
- `DELETE /admin/location/:id` - Delete location

See [**docs/API_DOCUMENTATION.md**](./docs/API_DOCUMENTATION.md) for detailed request/response examples.

## 🏗️ Architecture Overview

The application follows **NestJS modular architecture** with clear separation of concerns:

**Module Organization:**
- Each feature (User, Journey, Location, Admin) is a self-contained module
- Controllers handle HTTP requests and delegate to services
- Services contain business logic and database operations
- DTOs (Data Transfer Objects) validate and structure incoming data
- Entities define database schema and relationships

**Authentication Flow:**
1. User registration with email verification via OTP
2. Login confirmation with JWT token generation
3. JWT token used for subsequent authenticated requests
4. Passport strategies for route protection

**Database Layer:**
- TypeORM maps TypeScript entities to MySQL tables
- Automatic schema synchronization
- Support for relational queries and transactions

**Error Handling:**
- Global exception filters for consistent error responses
- HTTP status codes properly utilized
- Meaningful error messages for debugging

See [**docs/ARCHITECTURE.md**](./docs/ARCHITECTURE.md) for in-depth technical details.

## 📚 Documentation

- [**ARCHITECTURE.md**](./docs/ARCHITECTURE.md) - System design, data models, and technical decisions
- [**API_DOCUMENTATION.md**](./docs/API_DOCUMENTATION.md) - Complete endpoint reference with examples
- [**DEPLOYMENT_GUIDE.md**](./docs/DEPLOYMENT_GUIDE.md) - Production deployment instructions
- [**TypeORM Docs**](https://typeorm.io/) - Database ORM documentation
- [**NestJS Docs**](https://docs.nestjs.com/) - Framework documentation

## 🔐 Security Considerations

✅ **Implemented Security Measures:**
- Password hashing with bcrypt (10 salt rounds)
- JWT tokens with configurable expiration
- Route protection with JWT authentication guards
- Input validation with class-validator
- Environment variable protection (.env not in git)
- CORS and sanitization best practices

⚠️ **Security Notes:**
- Keep JWT_SECRET complex and secure (minimum 32 characters)
- Use HTTPS in production
- Change default database credentials
- Implement rate limiting for sensitive endpoints
- Regular dependency updates for security patches

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

Ensure all:
- Tests pass (`yarn test`)
- Code is formatted (`yarn format`)
- Linting passes (`yarn lint`)

## 📄 License

This project is licensed under the **UNLICENSED** license. See LICENSE file for details.

## 👥 Author

**Metro Rail App Development Team**

## 🆘 Support

For issues, questions, or feedback:
- Create an issue in the GitHub repository
- Check existing issues for solutions
- Review DEPLOYMENT_GUIDE.md for common issues

## 📞 Contact

For production support or enterprise requirements:
- Email: support@metrorailapp.com
- Documentation: See docs/ folder

---

**Last Updated:** April 2026  
**Version:** 0.0.1  
**Status:** Active Development

Ready to get started? Follow the [Installation & Setup](#-installation--setup) section above! 🚀
