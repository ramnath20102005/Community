# 🎓 Kongu Community Platform

A comprehensive community engagement platform for **Kongu Engineering College**, designed to bridge the gap between students, club members, alumni, and administrators. This platform serves as a unified information-sharing engine that fosters collaboration, mentorship, and professional growth within the Kongu ecosystem.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Technology Stack](#-technology-stack)
- [User Roles & Features](#-user-roles--features)
  - [1. Admin](#1-admin)
  - [2. Student](#2-student)
  - [3. Club Member](#3-club-member-student-sub-role)
  - [4. Alumni](#4-alumni)
- [Page-by-Page Feature Breakdown](#-page-by-page-feature-breakdown)
- [Security Features](#-security-features)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)

---

## 🚀 Project Overview

The Kongu Community Platform is a full-stack MERN application that provides a centralized hub for campus-wide communication, professional networking, and opportunity sharing. The platform implements a sophisticated role-based permission system that enables different user types to contribute meaningfully while maintaining security and content quality.

### Key Highlights

- **Role-Based Access Control (RBAC)**: Four distinct user types with granular permissions
- **Real-time Updates**: WebSocket-powered notifications for community events
- **Professional Networking**: Alumni directory with searchable profiles
- **Career Gateway**: Job posting and opportunity sharing system
- **Club Management**: Dedicated tools for student organizations
- **Editorial Design**: Premium magazine-style UI with responsive layouts

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **State Management**: Context API (Auth & Role contexts)
- **Styling**: Vanilla CSS with CSS Variables (Magazine Aesthetic)
- **Real-time**: Socket.io Client

### Backend
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **Real-time**: Socket.io Server

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Environment**: dotenv for configuration

---

## 👥 User Roles & Features

The platform supports four distinct user types, each with specific capabilities and access levels:

### 1. Admin

**Role Description**: System administrators with full platform control, responsible for user management, analytics monitoring, and maintaining platform integrity.

#### Core Capabilities
- ✅ **Complete User Management**
  - View all registered users (Students, Alumni, Club Members)
  - Promote students to Club Member status
  - Demote Club Members back to regular students
  - Assign club names and positions during promotion
  - Filter and search users by role, name, or email

- ✅ **Platform Analytics**
  - Total community member count
  - Active students statistics
  - Alumni network size
  - Club member engagement metrics
  - Real-time data refresh

- ✅ **Content Moderation**
  - Full access to all posts and events
  - Ability to manage any content on the platform
  - System-wide visibility

- ✅ **All User Permissions**
  - Can perform any action available to Students, Club Members, or Alumni
  - Create jobs, events, and announcements
  - Access all platform features

#### Admin-Specific Pages

**Admin Dashboard** (`/dashboard`)
- **Analytics View**
  - Total Community: Displays total registered users
  - Active Students: Count of current students
  - Alumni Network: Number of graduated members
  - Club Members: Students with posting privileges
  - Admins: System moderators count

- **User Management View**
  - Searchable user table with filters
  - User information cards showing:
    - Name and email
    - Role badge (STUDENT/ALUMNI/ADMIN)
    - Club Member status indicator
    - Department and batch year
    - Club name (if applicable)
  - Action buttons:
    - "Promote" button for eligible students
    - "Revoke Status" button for club members
  - Promotion modal with fields:
    - Club Name (e.g., "Google Developer Student Club")
    - Position (e.g., "Technical Lead")

---

### 2. Student

**Role Description**: Current Kongu Engineering College students who can consume content, interact with the community, and access opportunities shared by alumni and club members.

#### Core Capabilities
- ✅ **Content Consumption**
  - View all community posts and announcements
  - Read club updates and events
  - Browse job opportunities posted by alumni
  - Access resource materials

- ✅ **Community Interaction**
  - Like and comment on posts
  - Engage with events and opportunities
  - Connect with alumni through the directory

- ✅ **Professional Development**
  - Apply for jobs posted by alumni
  - Attend events and workshops
  - Network with alumni professionals

- ✅ **Profile Management**
  - Update personal information
  - Add bio and LinkedIn profile
  - Upload profile picture

#### Student-Specific Pages

**Student Dashboard** (`/dashboard`)
- **Welcome Header**
  - Personalized greeting with student's first name
  - "Campus Gateway" badge

- **Statistics Cards**
  - Community Feed: Total posts count with 🗞️ icon
  - Club Events: Count of events and club updates with 📅 icon
  - Opportunities: Job posts and resources count with 💼 icon

- **Recent Activity Feed**
  - Latest 5 posts from the community
  - Each activity item shows:
    - Publication date
    - Post type/club name
    - Title and content preview (truncated)
  - "View all →" link to Events page

**Events/Community Feed** (`/events`)
- **Page Header**
  - "The Commons" badge
  - "Campus Dialogue" title
  - Description of community updates

- **Event Cards Grid**
  - Responsive grid layout (auto-fill, min 400px)
  - Each card displays:
    - Featured image (if available)
    - Gallery indicator for multiple images
    - Post type badge (GENERAL/CLUB_UPDATE/EVENT/EXPERIENCE)
    - Event title
    - Content preview (4 lines max)
    - Author avatar and name
    - Author role
    - "Read Full Story" button

- **Event Detail Modal**
  - Full event information:
    - Complete title and description
    - Author details with avatar
    - Publication date
    - Location/venue (if applicable)
    - Event date (if scheduled)
    - Image gallery (if multiple images)
    - External links and attachments
    - Resources & assets section

**Jobs Hub** (`/jobs`)
- **Page Header**
  - "Career Gateway" badge
  - "Professional Opportunities" title
  - Description emphasizing alumni mentorship

- **Job Cards Grid**
  - Responsive grid layout
  - Each card shows:
    - Company name
    - Job type badge (Full-time/Part-time/Internship)
    - Position title
    - Location with 📍 icon
    - Salary (if disclosed) with 💰 icon
    - Job description preview (3 lines)
    - Posted by alumni name and avatar
    - "View Details" button

- **Job Detail Modal**
  - Complete job information:
    - Company and position
    - Location and job type
    - Full role description
    - Compensation details
    - Posted by alumni profile
    - Publication timeline
    - "Proceed to Apply →" button with external link

**Alumni Directory** (`/alumni`)
- **Page Header**
  - "The Network" badge
  - "Alumni Directory" title
  - Description of global alumni network

- **Search Functionality**
  - Search bar to filter by:
    - Alumni name
    - Company
    - Department

- **Alumni Profile Cards**
  - Grid layout (min 300px per card)
  - Each card displays:
    - Profile picture (or generated avatar)
    - Full name
    - Batch year and department
    - Bio/introduction
    - Current company
    - Location with 📍 icon
    - LinkedIn profile link 🔗

**Profile Page** (`/profile`)
- **Profile Editor**
  - Full Name field
  - Bio/About Me textarea
  - LinkedIn Profile URL
  - Profile Image URL
  - "Save Changes" button

- **Live Preview Panel**
  - Real-time preview of profile card
  - Shows how profile appears to others
  - Displays avatar, name, role badge
  - Shows bio and basic information

---

### 3. Club Member (Student Sub-Role)

**Role Description**: Students who have been promoted by an Admin to represent and manage campus clubs. They have all student permissions plus the ability to create and manage club-related content.

#### Core Capabilities
- ✅ **All Student Capabilities** (inherited)
  - Everything a regular student can do

- ✅ **Content Creation**
  - Create club updates and announcements
  - Post events and workshops
  - Share resources and materials
  - Upload images and attachments

- ✅ **Content Management**
  - Edit their own posts
  - Delete their own publications
  - Manage event details

- ✅ **Club Representation**
  - Posts are tagged with club name
  - Position displayed on profile
  - Special "Club Member" badge

#### Club Member-Specific Features

**Enhanced Dashboard** (`/dashboard`)
- Same as Student Dashboard, but with additional capabilities
- Access to "Start a Conversation" button on Events page

**Create Event Page** (`/events/create`)
- **Event Creation Form**
  - Title field
  - Content/Description textarea
  - Event Type selector:
    - GENERAL
    - CLUB_UPDATE
    - EVENT
    - EXPERIENCE
    - RESOURCE
  - Event Date picker (optional)
  - Location/Venue field (optional)
  - Main Image URL
  - Multiple Images URLs (gallery)
  - External Links section:
    - Label and URL pairs
    - Add multiple links
  - Attachments section:
    - File name and URL
    - Multiple document support
  - "Publish Event" button

**Edit Event Page** (`/events/edit/:id`)
- Pre-filled form with existing event data
- All fields editable
- "Update Event" button
- "Cancel" option

**Events Page Enhancements**
- "Start a Conversation" button visible in header
- "Manage Entry" button on own posts
- Edit and delete options in detail modal

**Profile Page**
- Additional fields:
  - Club Name (read-only, set by admin)
  - Position (read-only, set by admin)
- Special badge indicating Club Member status

---

### 4. Alumni

**Role Description**: Graduated Kongu Engineering College students who serve as mentors and career guides. They can share job opportunities, professional experiences, and industry insights with current students.

#### Core Capabilities
- ✅ **Job Opportunity Sharing**
  - Post full-time positions
  - Share internship opportunities
  - List part-time roles
  - Provide application links

- ✅ **Professional Content Creation**
  - Share career experiences
  - Post industry insights
  - Create resource materials
  - Publish general updates

- ✅ **Content Management**
  - Edit own job posts
  - Update opportunity details
  - Close/delete hiring posts
  - Manage all own publications

- ✅ **Mentorship & Networking**
  - Visible in Alumni Directory
  - Profile showcases current role
  - LinkedIn connectivity
  - Professional bio sharing

- ✅ **Profile Management**
  - Extended profile fields:
    - Current Organization
    - Location
    - Professional bio
    - LinkedIn URL
    - Profile picture

#### Alumni-Specific Pages

**Alumni Dashboard** (`/dashboard`)
- **Welcome Header**
  - "Alumni Excellence" badge
  - Personalized greeting
  - Motivational subtitle about empowering next generation

- **Contribution Statistics**
  - Jobs Posted: Count of active job publications with 💼 icon
  - Events Shared: Campus updates count with 🏛️ icon
  - Contributions: Total activity count with ✨ icon
  - Each stat shows label and sub-description

- **Active Contributions Feed**
  - Latest 4 posts created by the alumni
  - Each item shows:
    - Publication date
    - Post type
    - Title and content preview
    - "Manage" button linking to respective page
  - Empty state with quick action buttons:
    - "Post Job" button
    - "Share Update" button

**Create Job Page** (`/jobs/create`)
- **Job Posting Form**
  - Position Title
  - Company Name
  - Job Type selector:
    - Full-time
    - Part-time
    - Internship
    - Contract
  - Location field
  - Salary/Compensation (optional)
  - Job Description textarea
  - Application Link (external URL)
  - "Post Opportunity" button

**Edit Job Page** (`/jobs/edit/:id`)
- Pre-filled form with existing job data
- All fields editable
- "Update Job" button
- "Cancel" option

**Jobs Page Enhancements** (`/jobs`)
- "Post Opportunity" button visible in header
- "Your Publication" indicator on own posts
- "Manage & View" button on own job cards
- Job detail modal shows:
  - "Your Publication" badge
  - "Update Info" button
  - "Close Hire" button
  - Management controls

**Create Event/Update Page** (`/events/create`)
- Same as Club Member event creation
- Can share:
  - Professional experiences
  - Industry insights
  - Alumni events
  - Resource materials

**Profile Page** (`/profile`)
- **Extended Profile Fields**
  - Full Name
  - Current Organization (required for directory)
  - Location (city/country)
  - Bio/About Me (professional summary)
  - LinkedIn Profile URL
  - Profile Image URL
  - "Save Changes" button

- **Profile Preview**
  - Shows how profile appears in Alumni Directory
  - Displays company and location
  - Shows professional bio

**Alumni Directory Visibility**
- Alumni profiles automatically appear in directory
- Searchable by name, company, or department
- Profile card shows:
  - Professional photo
  - Name and batch year
  - Department
  - Current company
  - Location
  - Bio
  - LinkedIn link

---

## 📄 Page-by-Page Feature Breakdown

### Public Pages (No Authentication Required)

#### Landing Page (`/`)
- **Hero Section**
  - Platform introduction
  - Key value propositions
  - Call-to-action buttons

- **Features Showcase**
  - Student benefits
  - Alumni opportunities
  - Club management tools

- **Navigation**
  - Login button
  - Register button

#### Login Page (`/login`)
- **Authentication Form**
  - Email field (enforces @kongu.edu domain)
  - Password field
  - "Remember me" option
  - "Sign In" button
  - Link to registration page

- **Security Features**
  - University email validation
  - Error message display
  - Secure password handling

#### Register Page (`/register`)
- **Registration Form**
  - Full Name
  - Email (must be @kongu.edu)
  - Password with strength meter
  - Confirm Password
  - Department selector
  - Batch Year
  - "Create Account" button

- **Password Strength Estimator**
  - Real-time complexity evaluation
  - Visual strength indicator
  - Expert advice for secure passwords

- **Auto-Role Detection**
  - Automatically assigns STUDENT or ALUMNI based on email/batch year
  - No manual role selection needed

---

### Protected Pages (Authentication Required)

#### Dashboard (`/dashboard`)
- **Role-Specific Views**
  - Admin: Analytics + User Management
  - Student: Activity Feed + Stats
  - Club Member: Enhanced Student view
  - Alumni: Contribution Tracker

- **Common Elements**
  - Personalized greeting
  - Role-specific badge
  - Quick statistics
  - Recent activity

#### Events/Community Feed (`/events`)
- **All Users Can**
  - View all non-job posts
  - Read full event details
  - See author information
  - Access external links

- **Club Members & Alumni Can**
  - Create new posts
  - Edit own posts
  - Delete own posts

- **Content Types Displayed**
  - GENERAL updates
  - CLUB_UPDATE announcements
  - EVENT listings
  - EXPERIENCE shares
  - RESOURCE materials

#### Jobs Hub (`/jobs`)
- **All Users Can**
  - Browse job opportunities
  - View job details
  - Access application links
  - See alumni poster information

- **Alumni Can**
  - Post new opportunities
  - Edit own job posts
  - Close/delete own postings
  - Manage hiring status

- **Job Information Includes**
  - Company and position
  - Location and type
  - Salary (if provided)
  - Full description
  - Application process
  - Posted by details

#### Alumni Directory (`/alumni`)
- **Available to All Authenticated Users**
  - Browse all alumni profiles
  - Search by name, company, or department
  - View professional details
  - Access LinkedIn profiles

- **Profile Information**
  - Name and photo
  - Batch year and department
  - Current organization
  - Location
  - Professional bio
  - LinkedIn connectivity

#### Profile Page (`/profile`)
- **All Users Can Edit**
  - Full name
  - Bio/About me
  - LinkedIn URL
  - Profile picture

- **Alumni Additional Fields**
  - Current organization
  - Location

- **Live Preview**
  - Real-time profile card preview
  - Shows public-facing appearance

---

## 🔒 Security Features

### Authentication & Authorization
- **JWT-Based Authentication**
  - Secure token generation
  - Token expiration handling
  - Refresh token support

- **University Email Verification**
  - Enforces @kongu.edu domain
  - Prevents unauthorized registrations
  - Validates email format

- **Password Security**
  - bcrypt hashing (10 rounds)
  - Minimum 6 characters
  - Real-time strength estimation
  - Secure comparison

### Role-Based Access Control (RBAC)
- **Permission System**
  - Granular action-based permissions
  - Role hierarchy enforcement
  - Sub-role support (Club Members)

- **Protected Routes**
  - Frontend route guards
  - Backend middleware validation
  - Automatic redirect on unauthorized access

- **Permission Actions**
  - `VIEW_CONTENT`: Everyone
  - `INTERACT`: Everyone (like, comment)
  - `CREATE_CLUB_POST`: Club Members only
  - `CREATE_JOB`: Alumni and Admin only
  - `MANAGE_USERS`: Admin only
  - `ACCESS_ADMIN_PANEL`: Admin only

### Data Security
- **Input Validation**
  - Email format validation
  - Required field enforcement
  - Type checking

- **XSS Protection**
  - Content sanitization
  - Safe rendering practices

- **CORS Configuration**
  - Controlled origin access
  - Secure headers

---

## 🏁 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Running locally or MongoDB Atlas)
- **npm** (comes with Node.js)
- **Git** (for cloning)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd community
   ```

2. **Server Setup**
   ```bash
   cd server
   npm install
   ```

3. **Create Server Environment File**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. **Seed Admin Account (Optional)**
   ```bash
   node seedAdmin.js
   ```
   This creates a default admin account for initial setup.

5. **Start the Server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

6. **Client Setup** (New Terminal)
   ```bash
   cd client
   npm install
   ```

7. **Start the Client**
   ```bash
   npm run dev
   ```

8. **Access the Application**
   - Frontend: `http://localhost:5173` (or port shown in terminal)
   - Backend: `http://localhost:5000`

### Default Admin Credentials (if seeded)
- **Email**: `admin@kongu.edu`
- **Password**: `admin123`

**⚠️ Important**: Change the default admin password immediately after first login!

---

## 📂 Project Structure

```
community/
├── client/                          # Frontend React Application
│   ├── src/
│   │   ├── assets/                  # Images and static files
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Card.jsx            # Editorial card component
│   │   │   ├── Loader.jsx          # Loading spinner
│   │   │   ├── ErrorMessage.jsx    # Error display
│   │   │   ├── SuccessMessage.jsx  # Success notifications
│   │   │   ├── DetailModal.jsx     # Event/Job detail modal
│   │   │   └── ...
│   │   ├── context/                 # React Context providers
│   │   │   ├── AuthContext.jsx     # Authentication state
│   │   │   └── RoleContext.jsx     # Permission management
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.js          # Auth hook
│   │   │   └── useRole.js          # Permission hook
│   │   ├── layouts/                 # Page layouts
│   │   │   ├── MainLayout.jsx      # Main app layout
│   │   │   └── AuthLayout.jsx      # Auth pages layout
│   │   ├── pages/                   # Page components
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   ├── AlumniDashboard.jsx
│   │   │   │   └── AdminDashboard.jsx
│   │   │   ├── events/
│   │   │   │   ├── EventsList.jsx
│   │   │   │   └── CreateEvent.jsx
│   │   │   ├── jobs/
│   │   │   │   ├── JobsList.jsx
│   │   │   │   └── CreateJob.jsx
│   │   │   ├── alumni/
│   │   │   │   └── AlumniDirectory.jsx
│   │   │   ├── profile/
│   │   │   │   └── Profile.jsx
│   │   │   ├── Landing.jsx
│   │   │   └── NotFound.jsx
│   │   ├── routes/                  # Route configurations
│   │   │   ├── AppRoutes.jsx       # Main router
│   │   │   ├── ProtectedRoute.jsx  # Auth guard
│   │   │   └── RoleRoute.jsx       # Permission guard
│   │   ├── services/                # API service layer
│   │   │   ├── api.js              # Axios instance
│   │   │   ├── auth.service.js     # Auth API calls
│   │   │   ├── user.service.js     # User API calls
│   │   │   └── post.service.js     # Post API calls
│   │   ├── utils/                   # Utility functions
│   │   │   └── permissions.js      # Permission definitions
│   │   ├── styles/                  # Global styles
│   │   ├── App.jsx                  # Root component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global CSS variables
│   └── package.json
│
├── server/                          # Backend Node.js Application
│   ├── controllers/                 # Request handlers
│   │   ├── authController.js       # Auth logic
│   │   ├── userController.js       # User management
│   │   └── postController.js       # Post CRUD
│   ├── middleware/                  # Express middleware
│   │   └── auth.js                 # JWT verification
│   ├── models/                      # MongoDB schemas
│   │   ├── User.js                 # User model
│   │   └── Post.js                 # Post model
│   ├── routes/                      # API routes
│   │   ├── auth.js                 # /api/auth routes
│   │   ├── users.js                # /api/users routes
│   │   └── posts.js                # /api/posts routes
│   ├── uploads/                     # File uploads (if any)
│   ├── app.js                       # Express app setup
│   ├── server.js                    # Server entry point
│   ├── seedAdmin.js                 # Admin seeding script
│   ├── .env                         # Environment variables
│   └── package.json
│
├── .gitignore
├── README.md                        # This file
├── HACKATHON_IMPLEMENTATION.md      # Technical documentation
└── RESTRUCTURING_SUMMARY.md         # Architecture notes
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/me` | Get current user | Protected |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all users | Admin only |
| GET | `/alumni` | Get all alumni | Authenticated |
| PUT | `/profile` | Update own profile | Authenticated |
| PUT | `/:id/promote` | Promote to club member | Admin only |
| PUT | `/:id/demote` | Demote club member | Admin only |

### Post Routes (`/api/posts`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all posts | Authenticated |
| GET | `/:id` | Get single post | Authenticated |
| POST | `/` | Create new post | Permission-based |
| PUT | `/:id` | Update own post | Author only |
| DELETE | `/:id` | Delete own post | Author/Admin |

---

## 🎨 Design Philosophy

The platform follows a **magazine-style editorial aesthetic** with:

- **Typography**: Serif fonts for headings, sans-serif for body
- **Color Palette**: 
  - Off-white backgrounds (#FAFAF8)
  - Charcoal text (#2B2B2B)
  - Olive accents (#6B7A5A)
  - Warm tones for highlights
- **Layout**: Asymmetrical, content-focused designs
- **Spacing**: Generous whitespace for readability
- **Components**: Card-based architecture with subtle shadows
- **Responsiveness**: Mobile-first approach with breakpoints

---

## 🤝 Contributing

This is an educational project for Kongu Engineering College. For contributions or suggestions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 License

This project is created for educational purposes as part of Kongu Engineering College's community initiative.

---

## 👨‍💻 Support

For issues, questions, or feature requests, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for the Kongu Community**

*Empowering students, connecting alumni, fostering excellence.*
