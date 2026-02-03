const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Auto-detect role and department from Kongu email
 * Matches front-ends logic for consistency
 */
const detectRoleAndDept = (email) => {
    const domain = "@kongu.edu";
    if (!email.endsWith(domain)) return { role: 'STUDENT', dept: 'UNKNOWN', year: null, error: "Not a Kongu email" };

    // Bypass for special admin
    if (email.toLowerCase() === "admin@kongu.edu") return { role: 'ADMIN', dept: 'ROOT', year: 2000 };

    const username = email.split("@")[0];
    const match = username.match(/\.(\d{2})([a-z]{3})$/i);

    if (!match) return { role: 'STUDENT', dept: 'UNKNOWN', year: null, error: "Invalid format" };

    const [, yearDigits, deptCode] = match;
    const yearNum = parseInt(yearDigits, 10);
    const currentYearShort = new Date().getFullYear() % 100;

    // Range: 01 to currentYear
    if (yearNum < 1 || yearNum > currentYearShort) {
        return { role: 'STUDENT', dept: 'UNKNOWN', year: null, error: "Year out of range" };
    }

    const joiningYear = 2000 + yearNum;
    const currentYearFull = new Date().getFullYear();
    const graduationYear = joiningYear + 4;

    const role = currentYearFull > graduationYear ? 'ALUMNI' : 'STUDENT';

    return {
        role,
        dept: deptCode.toUpperCase(),
        year: joiningYear
    };
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("Processing register for:", { name, email });

        // Backend Password Validation for security
        if (password.length < 8) return res.status(400).json({ message: "Password must be 8+ characters" });
        if (!/[A-Z]/.test(password)) return res.status(400).json({ message: "Include at least one capital letter" });
        if (!/[a-z]/.test(password)) return res.status(400).json({ message: "Include at least one lowercase letter" });
        if (!/[0-9]/.test(password)) return res.status(400).json({ message: "Include at least one number" });
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return res.status(400).json({ message: "Include at least one special character" });

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const info = detectRoleAndDept(email);
        if (info.error) return res.status(400).json({ message: "Invalid email format or year restricted (01 - Current Year)" });

        // Special case for Admin registration
        let role = info.role;
        if (email.toLowerCase() === 'admin@kongu.edu') {
            role = 'ADMIN';
        }

        user = new User({
            name,
            email,
            password,
            role,
            department: info.dept,
            batchYear: info.year
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isClubMember: user.isClubMember
            }
        });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isClubMember: user.isClubMember,
                clubName: user.clubName,
                position: user.position
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: err.message });
    }
};
