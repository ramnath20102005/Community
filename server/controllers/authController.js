const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Auto-detect role and department from Kongu email
 * Matches front-ends logic for consistency
 */
const detectRoleAndDept = (email) => {
    const domain = "@kongu.edu";
    if (!email.endsWith(domain)) return { role: 'STUDENT', dept: 'UNKNOWN', year: null };

    const username = email.split("@")[0];
    const match = username.match(/\.(\d{2})([a-z]{3})$/i);

    if (!match) return { role: 'STUDENT', dept: 'UNKNOWN', year: null };

    const [, yearDigits, deptCode] = match;
    const currentYear = new Date().getFullYear();
    const joiningYear = 2000 + parseInt(yearDigits, 10);
    const graduationYear = joiningYear + 4;

    const role = currentYear > graduationYear ? 'ALUMNI' : 'STUDENT';

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

        // 1. Password Complexity Validation
        if (!password || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ message: "Add at least 1 capital letter" });
        }
        if (!/[a-z]/.test(password)) {
            return res.status(400).json({ message: "Add at least 1 small letter" });
        }
        if (!/[0-9]/.test(password)) {
            return res.status(400).json({ message: "Add at least 1 numeric character" });
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            return res.status(400).json({ message: "Add at least 1 special character" });
        }

        // 2. Email Basic Checks
        if (!email.endsWith("@kongu.edu")) {
            return res.status(400).json({ message: "Registration is exclusive to @kongu.edu" });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const info = detectRoleAndDept(email);

        // 3. Email Year Validation (01 to Current)
        if (email.toLowerCase() !== 'admin@kongu.edu') {
            const username = email.split("@")[0];
            const match = username.match(/\.(\d{2})[a-z]{3}$/i);
            if (!match) {
                return res.status(400).json({ message: "Invalid Kongu email format (name.yearDept@kongu.edu)" });
            }
            const yearDigits = parseInt(match[1], 10);
            const currentYearDigits = new Date().getFullYear() % 100;
            if (yearDigits < 1 || yearDigits > currentYearDigits) {
                return res.status(400).json({ message: `Year must be between 01 and ${currentYearDigits.toString().padStart(2, '0')}` });
            }
        }
        
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
