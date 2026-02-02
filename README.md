# Kongu Community Platform

A dedicated community engagement platform for **Kongu Engineering College**, designed to bridge the gap between students, club leads, and alumni.

## 🚀 Recent Updates & Features

### 🛡️ Security & Authentication
- **University Email Verification**: Both Login and Register pages now strictly enforce the `@kongu.edu` domain to ensure a secure, campus-exclusive environment.
- **Dynamic Password Strength Estimator**: A real-time security meter during registration that evaluates password complexity and provides expert advice to help users create resilient credentials.
- **Role-Aware Security**: Intelligent role detection that prioritizes backend profile data, preventing unauthorized access redirects during page reloads.

### 🎓 Alumni Hub
- **Professional Profiles**: Alumni can manage their digital presence with dedicated fields for current organization, location, bio, and LinkedIn connectivity.
- **Career Opportunity Sharing**: A specialized portal for Alumni to post job opportunities and internships exclusively for Kongu students.
- **Dynamic Network Directory**: A real-time, searchable board of all verified alumni, allowing students to filter by department or organization for mentorship.

### 📢 Community & Events
- **Integrated Campus Feed**: A unified space for general updates, club announcements, and alumni events.
- **Flexible Content Sharing**: Support for sharing hackathons, workshops, and personal career updates with optional image URLs for visual storytelling.
- **Real-time Notifications**: WebSocket-powered alerts that keep the entire community informed of new events and opportunities as they happen.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Context API, React Router, CSS Variables (Magazine Aesthetic).
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth.
- **Real-time**: WebSockets (Socket.io) for community-wide event notifications.

## 🏁 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or Atlas)

### Setup
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd community
   ```

2. **Server Setup**:
   ```bash
   cd server
   npm install
   # Create a .env file with:
   # PORT=5000
   # MONGO_URI=your_mongodb_uri
   # JWT_SECRET=your_secret
   npm start
   ```

3. **Client Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 📜 Project Structure
- `/client`: Frontend React application.
- `/server`: Express API and MongoDB models.
- `/client/src/pages`: Feature-specific pages (Alumni Directory, Jobs Hub, etc.).
- `/client/src/context`: Role and Auth state management.

---
Built with ❤️ for the Kongu Community.
