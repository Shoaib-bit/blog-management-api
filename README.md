# Blog Management API

A RESTful API built with NestJS, Prisma, and PostgreSQL for managing blog posts with user authentication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)

## ✨ Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **User Registration & Login**: Secure user registration with email validation and strong password requirements
- **Blog Post Management**: Create, read, update, and delete blog posts
- **Post Ownership**: Users can only edit/delete their own posts
- **Pagination**: Efficient pagination for blog posts listing
- **Search**: Search posts by title or content
- **Swagger Documentation**: Interactive API documentation
- **Input Validation**: Comprehensive validation using class-validator
- **Error Handling**: Centralized error handling with custom exceptions
- **Response Transformation**: Consistent API response format

## 🛠 Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma 7.x
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **Password Hashing**: bcrypt
- **API Documentation**: Swagger/OpenAPI
- **Development**: Hot reload with watch mode

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (v12 or higher)

## 🚀 Installation

1. **Clone the repository** (or navigate to the project folder):
   ```bash
   cd blog-management-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## ⚙️ Environment Configuration

1. **Create a `.env` file** in the root directory:
   ```bash
   cp .env.example .env
   ```

2. **Configure the environment variables** in `.env`:
   ```env
   PORT=8000
   DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"
   JWT_SECRET="your_super_secret_jwt_key_here"
   ```

   **Important Configuration Details**:
   - `PORT`: The port on which the server will run (default: 8000)
   - `DATABASE_URL`: PostgreSQL connection string format:
     ```
     postgresql://[user]:[password]@[host]:[port]/[database]
     ```
     Example: `postgresql://postgres:mypassword@localhost:5432/blog_db`
   - `JWT_SECRET`: A strong secret key for JWT token signing (use a complex string)

## 🗄️ Database Setup

1. **Ensure PostgreSQL is running** on your machine

2. **Create the database** (if not already created):
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE blog_db;
   
   # Exit
   \q
   ```

3. **Run Prisma migrations** to create database tables:
   ```bash
   npm run prisma:migrate
   ```
   
   This will create two tables:
   - `User`: Stores user information (id, name, email, password)
   - `Post`: Stores blog posts (id, title, content, authorId, createdAt, updatedAt)

4. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

5. **(Optional) Open Prisma Studio** to view/manage database:
   ```bash
   npm run studio
   ```
   This opens a GUI at `http://localhost:5555`

## 🏃 Running the Application

### Development Mode (with hot reload)
```bash
npm run start:dev
```

### Production Mode
```bash
# Build the application
npm run build

# Run production server
npm run start:prod
```

The API will be available at: `http://localhost:8000`

## 📚 API Documentation

Once the application is running, you can access:

- **Swagger UI**: `http://localhost:8000/docs`
  - Interactive API documentation
  - Test endpoints directly from the browser
  - View request/response schemas

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get JWT token | No |

### Posts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts` | Get all posts (with pagination & search) | No |
| GET | `/api/posts/:id` | Get a single post by ID | No |
| POST | `/api/posts` | Create a new post | Yes |
| PUT | `/api/posts/:id` | Update a post (owner only) | Yes |
| DELETE | `/api/posts/:id` | Delete a post (owner only) | Yes |

## 📝 Usage Examples

### 1. Register a New User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "StrongP@ss123",
    "confirmPassword": "StrongP@ss123"
  }'
```

**Password Requirements**:
- Minimum 6 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

**Response**:
```json
{
  "message": "Registration successful",
  "data": null
}
```

### 2. Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "StrongP@ss123"
  }'
```

**Response**:
```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Create a Post (Authenticated)

```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:8000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Getting Started with NestJS",
    "content": "NestJS is a progressive Node.js framework for building efficient and scalable server-side applications..."
  }'
```

**Response**:
```json
{
  "message": "Post created successfully",
  "data": {
    "id": 1,
    "title": "Getting Started with NestJS",
    "content": "NestJS is a progressive Node.js framework...",
    "authorId": 1,
    "createdAt": "2025-12-29T10:30:00.000Z",
    "updatedAt": "2025-12-29T10:30:00.000Z",
    "author": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 4. Get All Posts (with Pagination & Search)

```bash
# Get all posts (default: page 1, limit 10)
curl http://localhost:8000/api/posts

# With pagination
curl "http://localhost:8000/api/posts?page=1&limit=5"

# With search
curl "http://localhost:8000/api/posts?query=NestJS"

# Combined
curl "http://localhost:8000/api/posts?query=NestJS&page=1&limit=10"
```

**Response**:
```json
{
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "Getting Started with NestJS",
        "content": "NestJS is a progressive...",
        "authorId": 1,
        "createdAt": "2025-12-29T10:30:00.000Z",
        "updatedAt": "2025-12-29T10:30:00.000Z",
        "author": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  },
  "message": "Posts retrieved successfully"
}
```

### 5. Get Single Post

```bash
curl http://localhost:8000/api/posts/1
```

### 6. Update a Post (Authenticated, Owner Only)

```bash
TOKEN="your_jwt_token_here"

curl -X PUT http://localhost:8000/api/posts/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Getting Started with NestJS - Updated",
    "content": "Updated content here..."
  }'
```

### 7. Delete a Post (Authenticated, Owner Only)

```bash
TOKEN="your_jwt_token_here"

curl -X DELETE http://localhost:8000/api/posts/1 \
  -H "Authorization: Bearer $TOKEN"
```

## 📁 Project Structure

```
blog-management-api/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── auth.controller.ts   # Auth endpoints (login, register)
│   │   ├── auth.service.ts      # Auth business logic
│   │   ├── auth.dto.ts          # Auth DTOs (LoginDto, RegisterDto)
│   │   └── auth.module.ts       # Auth module configuration
│   │
│   ├── post/                    # Blog posts module
│   │   ├── post.controller.ts   # Post endpoints (CRUD)
│   │   ├── post.service.ts      # Post business logic
│   │   ├── post.dto.ts          # Post DTOs (CreatePostDto, UpdatePostDto, etc.)
│   │   └── post.module.ts       # Post module configuration
│   │
│   ├── common/                  # Shared resources
│   │   ├── services/
│   │   │   └── prisma.service.ts    # Prisma database service
│   │   ├── guard/
│   │   │   └── auth.guard.ts        # JWT authentication guard
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts  # Global exception filter
│   │   ├── interceptors/
│   │   │   └── transform-response.interceptor.ts  # Response transformer
│   │   ├── exceptions/
│   │   │   ├── invalid-credentials.exception.ts
│   │   │   └── post-ownership.exception.ts
│   │   ├── utils/
│   │   │   └── password.util.ts     # Password hashing utilities
│   │   └── types/
│   │       ├── types.ts             # Common types
│   │       └── express.d.ts         # Express type extensions
│   │
│   ├── app.module.ts            # Root application module
│   └── main.ts                  # Application entry point
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
│
├── generated/prisma/            # Auto-generated Prisma client
├── .env                         # Environment variables (create from .env.example)
├── .env.example                 # Environment template
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🔧 Available Scripts

```bash
# Development
npm run start:dev              # Start in watch mode (hot reload)
npm run start                  # Start in normal mode
npm run start:debug            # Start in debug mode

# Build
npm run build                  # Build for production

# Production
npm run start:prod             # Run production build

# Database
npm run prisma:generate        # Generate Prisma Client
npm run prisma:migrate         # Run database migrations
npm run studio                 # Open Prisma Studio (database GUI)

# Code Quality
npm run lint                   # Lint code
npm run format                 # Format code with Prettier

# Testing
npm run test                   # Run unit tests
npm run test:watch             # Run tests in watch mode
npm run test:cov               # Run tests with coverage
npm run test:e2e               # Run end-to-end tests
```

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: All inputs are validated using class-validator
- **SQL Injection Protection**: Prisma ORM provides protection
- **Authorization**: Post ownership verification for update/delete operations

## ❗ Common Issues & Solutions

### 1. Database Connection Error
```
Error: P1001: Can't reach database server
```
**Solution**: 
- Ensure PostgreSQL is running
- Verify DATABASE_URL in `.env` is correct
- Check PostgreSQL credentials and port

### 2. Prisma Client Not Found
```
Error: @prisma/client did not initialize yet
```
**Solution**:
```bash
npm run prisma:generate
```

### 3. Migration Failed
```
Error: Database 'blog_db' does not exist
```
**Solution**:
```bash
# Create database manually
psql -U postgres -c "CREATE DATABASE blog_db;"
# Then run migrations
npm run prisma:migrate
```

### 4. JWT Token Invalid
```
401 Unauthorized: Invalid or expired token
```
**Solution**:
- Ensure JWT_SECRET in `.env` matches the one used to sign tokens
- Get a fresh token by logging in again
- Check token format: `Bearer <token>`

## 📧 Support

For issues or questions, please open an issue in the repository.

## 📄 License

This project is licensed under the UNLICENSED License.
