/**
 * Seed Users for Hackathon Demo
 * These represent real-world roles in the college community
 * 
 * New Structure:
 * - baseRole: STUDENT, ALUMNI, ADMIN
 * - isClubMember: Boolean
 * - clubStatus: PENDING, APPROVED, REJECTED
 */

export const seedUsers = [
    {
        id: "lead_001",
        name: "Rahul Kumar",
        email: "rahul.23cse@kongu.edu",
        role: "STUDENT", // Base role
        isClubMember: true, // Sub-role status
        clubStatus: "APPROVED",
        position: "President",
        club: "Coding Club",
        department: "CSE",
        joiningYear: 2023,
        bio: "Passionate about full-stack development and competitive programming."
    },
    {
        id: "lead_002",
        name: "Priya Sharma",
        email: "priya.24ece@kongu.edu",
        role: "STUDENT",
        isClubMember: true,
        clubStatus: "APPROVED",
        position: "Event Coordinator",
        club: "Student Council",
        department: "ECE",
        joiningYear: 2024,
        bio: "Helping organize campus-wide events and hackathons."
    },
    {
        id: "student_001",
        name: "Vicky J",
        email: "vicky.25cse@kongu.edu",
        role: "STUDENT",
        isClubMember: true,
        clubStatus: "PENDING", // Testing approval flow
        department: "CSE",
        joiningYear: 2025,
        bio: "New student interested in robotics."
    },
    {
        id: "alumni_001",
        name: "Arjun Dev",
        email: "arjun.19it@kongu.edu",
        role: "ALUMNI",
        company: "Google",
        designation: "Software Engineer",
        department: "IT",
        joiningYear: 2019,
        graduationYear: 2023
    },
    {
        id: "admin_001",
        name: "Admin User",
        email: "admin@kongu.edu",
        role: "ADMIN",
        isAdmin: true
    }
];