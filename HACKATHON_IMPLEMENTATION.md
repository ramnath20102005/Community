# 🚀 Kongu Student-Alumni Community Platform - Full Stack Editorial Edition

## ✅ Project Overview
A production-grade, hackathon-ready platform designed as a sophisticated **Information Sharing Engine** for students and alumni of Kongu Engineering College. 

---

## 📂 FULL STACK ARCHITECTURE

### 🟢 Backend (Node.js/Express + MongoDB)
The backend is built for security, role-based access, and automated intelligence.

- **`server/models/`**
  - `User.js`: Stores base roles (STUDENT, ALUMNI, ADMIN) and sub-role status (`isClubMember`).
  - `Post.js`: Central schema for all community information (General, Club, Jobs, Resources).

- **`server/controllers/`**
  - `authController.js`: Handles registration with **Auto-Role Logic** (parses `@kongu.edu` emails to distinguish Students from Alumni).
  - `userController.js`: Empowering the **ADMIN** to manage the community. Admin can promote any student to a "Club Member" with a single click.
  - `postController.js`: Permission-gated posting logic. Only approved Club Members can post Club Updates; only Alumni/Admin can post Jobs.

- **`server/middleware/`**
  - `auth.js`: JWT-based protection and dynamic permission authorization.

- **`server/routes/`**
  - `/api/auth`: Login/Register.
  - `/api/users`: Admin-only user management (Promotion/Demotion).
  - `/api/posts`: The Information Sharing Engine feed.

---

### 🔵 Frontend (React + Editorial UI)
- **Design Philosophy**: High-fashion editorial look (Off-white, Serif fonts, Asymmetrical layouts).
- **State Management**: Context API for Auth and Role checks (`can()` function for PBAC).
- **Routing**: `AppRoutes.jsx` with `ProtectedRoute` and `RoleRoute` wrappers.

---

## 🔄 The New Role & Permission Logic
1. **The Entry Point**: Every user registers as a **STUDENT** (or **ALUMNI** if detected by year).
2. **The Power of Admin**: There is no "Request/Pending" queue. The Admin identifies talent in the community and directly grants **Club Member** status.
3. **Dynamic Permissions**: 
   - Once promoted, the user's frontend instantly unlocks the "Post Club Update" action.
   - The backend validates this status for every POST request to maintain security headers.

---

## 🚀 How to Run
1. **Backend**: 
   ```bash
   cd server
   npm install
   npm run dev
   ```
2. **Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

**The system is now fully architecture-complete.** 🏆
