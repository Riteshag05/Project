# Authentication System with React and NestJS

This project implements a full-stack authentication system with a React frontend and NestJS backend.

## Project Structure

- `/src` - React frontend
- `/backend` - NestJS backend

## Features

- User registration and login
- JWT-based authentication
- Protected routes
- User profile page
- Swagger API documentation

## Getting Started

### Frontend

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run start:dev
   ```

## API Documentation

Once the backend is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api
```

## Environment Variables

### Backend

Create a `.env` file in the backend directory with the following variables:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=authe_db

JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
```

## Database Setup

The application uses PostgreSQL. Make sure you have PostgreSQL installed and running.

You can create a new database with:

```sql
CREATE DATABASE authe_db;
```

The tables will be automatically created when the application starts (in development mode).