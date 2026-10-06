# TaskFlow - Next.js To-Do List Application

A modern, responsive to-do list web application built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **Prisma** (SQLite for local dev / easily swappable with PostgreSQL), and **NextAuth.js**.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router) & React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Lucide Icons
- **Database ORM**: Prisma ORM with SQLite (local) / PostgreSQL ready
- **Authentication**: NextAuth.js (Auth.js) Credentials Provider with `bcryptjs` password hashing
- **Validation**: Zod schema validation on API routes

---

## ✨ Features

- **Authentication**:
  - Sign up (`/register`) with name, email, and password (min 6 characters)
  - Log in (`/login`) with email & password
  - Log out from the navigation bar
  - Passwords hashed using `bcryptjs`
  - Route protection via Next.js `middleware.ts` for `/dashboard`
- **Task Management**:
  - Create tasks with title, optional description, priority (`LOW`, `MEDIUM`, `HIGH`), and optional due date
  - Edit existing tasks inline
  - Toggle complete / incomplete with immediate visual feedback
  - Delete tasks with confirmation
  - Cascade deletion on user removal
- **Filtering**:
  - Filter by `All`, `Active`, and `Completed` with dynamic task counters
  - Visual progress bar tracking completed tasks
- **Architecture**:
  - **Server Components** for initial data fetching and page rendering (`/dashboard`)
  - **Client Components** for real-time interactivity and instant state updates
  - Clean API routes with Zod schema validation

---

## 🚀 Getting Started

### 1. Environment Variables

An `.env` file is already created in the project root:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="super-secret-nextauth-key-123456789"
```

For production with PostgreSQL, simply change `DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"` and update `provider = "postgresql"` in `prisma/schema.prisma`.

### 2. Database Setup

The SQLite database is initialized with Prisma:

```bash
npx prisma db push
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
todo-app/
├── prisma/
│   ├── schema.prisma              # User and Task Prisma models
│   └── dev.db                     # Local SQLite database
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/ # NextAuth auth endpoints
│   │   │   │   └── register/      # User sign-up endpoint with Zod & bcrypt
│   │   │   └── tasks/
│   │   │       ├── route.ts       # GET (filtered) and POST tasks
│   │   │       └── [id]/route.ts  # PATCH and DELETE task
│   │   ├── dashboard/page.tsx     # Protected Server Component
│   │   ├── login/page.tsx         # Sign in page
│   │   ├── register/page.tsx      # Sign up page
│   │   ├── layout.tsx             # Root layout with AuthProvider & Navbar
│   │   └── page.tsx               # Landing page
│   ├── components/
│   │   ├── AuthProvider.tsx       # NextAuth session context
│   │   ├── Navbar.tsx             # Responsive navigation header
│   │   ├── TaskForm.tsx           # Task creation modal/form
│   │   ├── TaskItem.tsx           # Individual task item with actions
│   │   ├── TaskList.tsx           # Task list container & empty state
│   │   ├── FilterBar.tsx          # Status filter pills with counts
│   │   └── DashboardClient.tsx    # Interactive dashboard state manager
│   ├── lib/
│   │   ├── auth.ts                # NextAuth options & credentials provider
│   │   ├── prisma.ts              # Prisma singleton client
│   │   └── validations.ts         # Zod schemas (Auth & Task CRUD)
│   ├── middleware.ts              # Protects /dashboard
│   └── types/                     # TypeScript definitions
└── package.json
```
