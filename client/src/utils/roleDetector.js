/**
 * Email-Based Role Detection for @kongu.edu
 * Format: abc.23cse@kongu.edu
 * Extract: 23 (joining year), cse (department)
 * Rule: If currentYear > joiningYear + 4 → ALUMNI, else → STUDENT
 */

const KONGU_EMAIL_DOMAIN = "@kongu.edu";
const COURSE_DURATION = 4;

/**
 * Parse Kongu email to extract joining year and department
 */
export const parseKonguEmail = (email) => {
    if (!email || !email.endsWith(KONGU_EMAIL_DOMAIN)) {
        return null;
    }

    const username = email.split("@")[0];
    const match = username.match(/\.(\d{2})([a-z]{3})$/i);

    if (!match) return null;

    const [, yearDigits, department] = match;
    const currentCentury = Math.floor(new Date().getFullYear() / 100) * 100;
    const joiningYear = currentCentury + parseInt(yearDigits, 10);

    return {
        joiningYear,
        department: department.toUpperCase(),
    };
};

/**
 * Detect role from Kongu email
 */
export const detectRoleFromEmail = (email) => {
    const parsed = parseKonguEmail(email);
    if (!parsed) return "STUDENT";

    const currentYear = new Date().getFullYear();
    const graduationYear = parsed.joiningYear + COURSE_DURATION;

    return currentYear > graduationYear ? "ALUMNI" : "STUDENT";
};

/**
 * Detects user role from user object
 * This is the central logic for role identification in the UI
 * @param {Object} user 
 * @returns {string} - User role (STUDENT, STUDENT_EDITOR, ALUMNI, ADMIN)
 */
export const detectUserRole = (user) => {
    if (!user) return null;

    // 1. ADMIN - Highest Priority
    if (user.isAdmin || user.role === "ADMIN") {
        return "ADMIN";
    }

    // 2. STUDENT_EDITOR (Approved Club Member)
    // If user is a student AND is an approved club member, they are an Editor in the UI
    if (user.isClubMember) {
        return "STUDENT_EDITOR";
    }

    // Explicit check for known roles from backend (Case Insensitive)
    const upperRole = user.role?.toUpperCase();
    if (upperRole === "ALUMNI") return "ALUMNI";
    if (upperRole === "STUDENT_EDITOR") return "STUDENT_EDITOR";
    if (upperRole === "STUDENT") return "STUDENT";
    if (upperRole === "ADMIN") return "ADMIN";

    // 4. Default to auto-detect from email ONLY if role is missing or generic
    if (user.email) {
        return detectRoleFromEmail(user.email);
    }

    return upperRole || "STUDENT";
};

/**
 * Get role display name
 * @param {string} role - Role identifier
 * @returns {string} - Display name
 */
export const getRoleDisplayName = (role) => {
    const roleNames = {
        STUDENT: "Student",
        STUDENT_EDITOR: "Club Member", // Changed from "Club Lead" to be more inclusive as per user request
        ALUMNI: "Alumni",
        ADMIN: "Administrator",
    };
    return roleNames[role] || "User";
};

/**
 * Validate Kongu email format
 */
export const isValidKonguEmail = (email) => {
    if (!email || !email.endsWith(KONGU_EMAIL_DOMAIN)) return false;
    return parseKonguEmail(email) !== null;
};
