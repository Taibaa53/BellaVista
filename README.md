# 🍷 Bella Vista — Digital Menu & Ordering System

Bella Vista is a premium, full-stack digital menu and live ordering platform for restaurants. Built with **React 18**, **Node.js (Express)**, and **Prisma**, it's optimized for high performance and seamless management of restaurant operations.

---

## 🚀 Live Demo
**[https://bella-vista-xi.vercel.app/](https://bella-vista-xi.vercel.app/)**

---

## 🏗️ Technology Stack

- **Frontend**: [React 18](https://reactjs.org/), [Vite](https://vitejs.dev/), [React Router 6](https://reactrouter.com/)
- **Backend**: [Node.js](https://nodejs.org/), [Express 4](https://expressjs.com/)
- **Database**: [Supabase (PostgreSQL)](https://supabase.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Deployment**: [Vercel](https://vercel.com/) (Zero-Config Monorepo)

---

## 📂 Project Structure

This is a modern monorepo setup:

- `/client`: The React frontend application.
- `/server`: The Express backend and Prisma logic.
- `/api`: The **Vercel Bridge**. Standard entry point to enable Zero-Config serverless functions on Vercel.
- `/prisma`: Root-level database schema for unified management.

---

## 🔧 Essential Environment Variables

Your `.env` in the root (for Vercel) must contain:

| Variable | Purpose |
| :--- | :--- |
| `DATABASE_URL` | **Pooler URL** (Port 6543) + `?pgbouncer=true&statement_cache_size=0` |
| `DIRECT_URL` | **Direct URL** (Port 5432) for Prisma migrations. |
| `ADMIN_USERNAME` | Username for the `/admin` portal. |
| `ADMIN_PASSWORD` | Password for the `/admin` portal. |
| `JWT_SECRET` | Secure key for admin authentication. |

---

## 💻 Local Development

1. **Clone the repo.**
2. **Install all dependencies:**
   ```bash
   npm install && cd client && npm install && cd ../server && npm install
   ```
3. **Setup Database**:
   - Create a Supabase project.
   - Run: `cd server && npx prisma db push`
4. **Run the Apps**:
   - **Frontend**: `cd client && npm run dev`
   - **Backend**: `cd server && npm run dev`

---

## 🚀 Production Deployment (Vercel)

The project is pre-configured with `vercel.json` and root-level build scripts. 

### Critical Build Instruction:
In the Vercel Dashboard, under **Settings -> Build & Development Settings**, use the following:
- **Build Command**: `cd client && npm install && npm run build && cd ../server && npm install && npx prisma generate`
- **Output Directory**: `client/dist`

### Database Troubleshooting:
If using **Supabase**, ensure your `DATABASE_URL` includes `?sslmode=require&pgbouncer=true&statement_cache_size=0` to prevent "Prepared Statement" errors in Vercel's multi-request environment.

---

## 👨‍💻 Author
**Bella Vista Team**
*Built with ❤️ for a seamless dining experience.*
