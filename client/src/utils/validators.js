/**
 * Validation utility functions
 */

export const validators = {
    /**
     * Validate email format and @kongu.edu domain
     */
    email: (value) => {
        if (!value) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return "Please enter a valid email address";
        }
        return "";
    },

    /**
     * Specialized Kongu email validator
     */
    konguEmail: (value) => {
        if (!value) return "Email is required";
        if (!value.endsWith("@kongu.edu")) {
            return "Registration is exclusive to @kongu.edu email addresses";
        }
        
        const pattern = /\.(\d{2})([a-z]{3})@kongu\.edu$/i;
        const match = value.match(pattern);
        
        if (!match) {
            return "Format: name.yearDept@kongu.edu (e.g., student.23cse@kongu.edu)";
        }

        const yearDigits = parseInt(match[1], 10);
        const currentYear = new Date().getFullYear();
        const currentYearDigits = currentYear % 100;

        // Restriction: year between 01 (2001) and current year
        if (yearDigits < 1 || yearDigits > currentYearDigits) {
            return `Year must be between 2001 and ${currentYear}`;
        }
        
        return "";
    },

    /**
     * Validate password strength (Min 8 chars, 1 Cap, 1 Small, 1 Num, 1 Special)
     */
    password: (value) => {
        if (!value) return "Password is required";
        
        if (value.length < 8) {
            return "Password must be at least 8 characters long";
        }
        
        if (!/[A-Z]/.test(value)) {
            return "Add at least 1 capital letter";
        }
        
        if (!/[a-z]/.test(value)) {
            return "Add at least 1 small letter";
        }
        
        if (!/[0-9]/.test(value)) {
            return "Add at least 1 numeric character";
        }
        
        if (!/[^A-Za-z0-9]/.test(value)) {
            return "Add at least 1 special character";
        }
        
        return "";
    },

    /**
     * Detailed password strength estimation
     */
    passwordStrength: (password) => {
        if (!password) return { score: 0, message: "Enter a password", color: "#ccc" };

        let score = 0;
        if (password.length > 6) score++;
        if (password.length > 10) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        const levels = [
            { score: 0, label: "Very Weak", color: "#ff4d4f", advice: "Add more characters" },
            { score: 1, label: "Weak", color: "#ffa940", advice: "Mix letters and numbers" },
            { score: 2, label: "Fair", color: "#ffec3d", advice: "Add uppercase and symbols" },
            { score: 3, label: "Good", color: "#73d13d", advice: "Almost there! Use symbols" },
            { score: 4, label: "Strong", color: "#52c41a", advice: "Great password!" },
            { score: 5, label: "Excellent", color: "#237804", advice: "Highly secure!" }
        ];

        const result = levels[Math.min(score, 5)];
        return {
            score,
            label: result.label,
            color: result.color,
            advice: result.advice
        };
    },

    /**
     * Validate password confirmation
     */
    confirmPassword: (value, allValues) => {
        if (!value) return "Please confirm your password";
        if (value !== allValues.password) {
            return "Passwords do not match";
        }
        return "";
    },

    /**
     * Validate required field
     */
    required: (fieldName) => (value) => {
        if (!value || (typeof value === "string" && !value.trim())) {
            return `${fieldName} is required`;
        }
        return "";
    },

    /**
     * Validate minimum length
     */
    minLength: (min, fieldName) => (value) => {
        if (!value) return "";
        if (value.length < min) {
            return `${fieldName} must be at least ${min} characters`;
        }
        return "";
    },

    /**
     * Validate maximum length
     */
    maxLength: (max, fieldName) => (value) => {
        if (!value) return "";
        if (value.length > max) {
            return `${fieldName} must not exceed ${max} characters`;
        }
        return "";
    },

    /**
     * Validate phone number
     */
    phone: (value) => {
        if (!value) return "";
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value.replace(/[\s-]/g, ""))) {
            return "Please enter a valid 10-digit phone number";
        }
        return "";
    },

    /**
     * Validate URL
     */
    url: (value) => {
        if (!value) return "";
        try {
            new URL(value);
            return "";
        } catch {
            return "Please enter a valid URL (include http:// or https://)";
        }
    },

    /**
     * Validate LinkedIn URL
     */
    linkedIn: (value) => {
        if (!value) return "";
        const error = validators.url(value);
        if (error) return error;
        if (!value.toLowerCase().includes("linkedin.com/")) {
            return "Please enter a valid LinkedIn profile URL";
        }
        return "";
    },

    /**
     * Validate LeetCode URL
     */
    leetCode: (value) => {
        if (!value) return "";
        const error = validators.url(value);
        if (error) return error;
        if (!value.toLowerCase().includes("leetcode.com/")) {
            return "Please enter a valid LeetCode profile URL";
        }
        return "";
    },

    /**
     * Validate date
     */
    date: (value) => {
        if (!value) return "";
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            return "Please enter a valid date";
        }
        return "";
    },

    /**
     * Validate future date
     */
    futureDate: (value) => {
        if (!value) return "";
        const date = new Date(value);
        const now = new Date();
        if (date <= now) {
            return "Date must be in the future";
        }
        return "";
    },

    /**
     * Validate number
     */
    number: (value) => {
        if (!value) return "";
        if (isNaN(value)) {
            return "Please enter a valid number";
        }
        return "";
    },

    /**
     * Validate positive number
     */
    positiveNumber: (value) => {
        if (!value) return "";
        if (isNaN(value) || Number(value) <= 0) {
            return "Please enter a positive number";
        }
        return "";
    },
};

/**
 * Compose multiple validators
 */
export const composeValidators = (...validators) => (value, allValues) => {
    for (const validator of validators) {
        const error = validator(value, allValues);
        if (error) return error;
    }
    return "";
};
