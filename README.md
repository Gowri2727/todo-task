# To-Do Master Application

A professional, production-grade Android To-Do application built with a **React Native CLI + TypeScript** mobile frontend and a **Node.js + Express + MongoDB** backend.

---

## 🏗️ System Architecture

The application is built following **Clean Architecture** principles to separate concerns, ensure scalability, prevent duplicated logic, and enforce strong type safety across both frontend and backend codebases.

```
todo-app/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration (Mongoose connection)
│   │   ├── controllers/     # Route logic (Auth Controller, Task Controller)
│   │   ├── middleware/      # JWT authentication middleware & router guards
│   │   ├── models/          # Mongoose Schemas (User & Task schemas)
│   │   ├── routes/          # API endpoint router mappings
│   │   ├── validators/      # Input payload validation rules using express-validator
│   │   └── app.js           # Express main server entry point with helmet/cors/morgan
│   ├── .env                 # Backend environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI elements (TaskItem, TaskModal, Dashboard, etc.)
    │   ├── constants/       # App-wide constants (COLORS, CATEGORIES, PRIORITIES)
    │   ├── hooks/           # Custom React Hooks (useTasks, useAppSelector, useAppDispatch)
    │   ├── navigation/      # React Navigation Native Stack structure
    │   ├── redux/           # Redux Toolkit Slices (authSlice, taskSlice) & Store
    │   ├── screens/         # Page Views (LoginScreen, RegisterScreen, HomeScreen)
    │   └── types/           # TypeScript Type Definitions
    ├── App.tsx              # Application Main Entrance & Providers Wrapper
    └── package.json
```

---

## 🛠️ Assignment Requirement Verification Checklist

Every single requirement listed in the assignment has been fully implemented and verified:

| Requirement Group | Specific Requirement | Implementation Status | Evidence Source Code |
| :--- | :--- | :---: | :--- |
| **Authentication** | Register with Name, Email, Password, Confirm Password | **Fully Satisfied** | `RegisterScreen.tsx`, `validators.js` |
| | Email & Password validation both frontend & backend | **Fully Satisfied** | `RegisterScreen.tsx`, `validators.js` |
| | Password hashing using bcrypt | **Fully Satisfied** | `User.js` (Mongoose pre-save middleware) |
| | JWT Authentication Session Persistence | **Fully Satisfied** | `authSlice.ts`, `AppNavigation.tsx` (using AsyncStorage) |
| | Token storage & Auto-login on app launch | **Fully Satisfied** | `authSlice.ts` (`checkAutoLogin` Thunk), `AppNavigation.tsx` |
| | Logout capability | **Fully Satisfied** | `authSlice.ts`, `HomeScreen.tsx` |
| **Task Management**| Full CRUD (Create, Read, Update, Delete) | **Fully Satisfied** | `taskController.js`, `taskSlice.ts`, `TaskModal.tsx` |
| | Toggle Complete / Incomplete | **Fully Satisfied** | `taskController.js` (`patchTaskComplete`), `TaskItem.tsx` |
| | View Task Details Modal | **Fully Satisfied** | `TaskDetailsModal.tsx`, `HomeScreen.tsx` |
| **Sorting** | Intelligent dynamic sorting algorithm (Priority High > Med > Low → Earlier Deadline → Newest Created) | **Fully Satisfied** | `useTasks.ts` (Dynamic Sorting Hook) |
| **Filtering & Search**| All, Completed, Pending filters | **Fully Satisfied** | `useTasks.ts`, `HomeScreen.tsx` |
| | High/Medium/Low Priority filters | **Fully Satisfied** | `useTasks.ts`, `HomeScreen.tsx` |
| | Today's Tasks, Upcoming, Overdue filters | **Fully Satisfied** | `useTasks.ts`, `HomeScreen.tsx` |
| | Real-time Search by Title, Description, Category | **Fully Satisfied** | `useTasks.ts` (Dynamic Filter Hook) |
| **Dashboard** | Total, Completed, Pending, Overdue, Today stats | **Fully Satisfied** | `useTasks.ts` (Stats Calculator), `DashboardComponent.tsx` |
| | Completion percentage + Progress Bar | **Fully Satisfied** | `DashboardComponent.tsx` |
| **UX & Badging** | Due Soon indicator (<= 24 hours remaining) | **Fully Satisfied** | `TaskItem.tsx` (Due Soon dynamic indicator badge) |
| | Overdue badge indicator | **Fully Satisfied** | `TaskItem.tsx` (Overdue indicator badge) |
| | Global Toast Error Handling & Snackbars | **Fully Satisfied** | `HomeScreen.tsx` (Snackbar feedback controller) |
| | Custom theme colors & rounded Material Cards | **Fully Satisfied** | `COLORS` in `index.ts`, `TaskItem.tsx` styles |

---

## ⚡ Getting Started & Run Guidelines

### 1. Prerequisite Installations
- Install **Node.js** (version 18 or above recommended)
- Install **MongoDB** (ensure a local MongoDB server is running on `mongodb://localhost:27017/` or configure a custom cloud URI)
- Configure **Android Studio** and set up an **Android Emulator** or plug in a physical device. Ensure your `ANDROID_HOME` env variables are exported correctly.

### 2. Run the Backend API
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install standard production and development dependencies:
   ```bash
   npm install
   ```
3. Verify your configuration in the `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/todo-app
   JWT_SECRET=production_quality_jwt_secret_key_12345
   NODE_ENV=production
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *The server will spin up and connect to MongoDB successfully on port 5000.*

### 3. Run the React Native CLI Mobile Frontend
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React Native development Bundler:
   ```bash
   npx react-native start
   ```
4. Build and compile the native application onto your connected Android Emulator or device:
   ```bash
   npx react-native run-android
   ```

---

## 📡 Protected API Endpoints

All Task API endpoints are protected using secure bearer JWT tokens.

### Auth Router (`/api/auth`)
- `POST /register` - Registers a new user. Enforces email uniqueness, format checking, and password strength validators.
- `POST /login` - Verifies user credentials and returns a secure JWT.
- `GET /profile` - Fetches current profile info (used for secure session restoration).

### Task Router (`/api/tasks`)
- `GET /` - Fetches all tasks associated with the authenticated user.
- `POST /` - Creates a new task.
- `GET /:id` - Fetches details for a single task.
- `PUT /:id` - Updates task attributes (title, description, priority, category, deadline).
- `PATCH /:id/complete` - Toggles task completion status securely.
- `DELETE /:id` - Removes a task permanently.
