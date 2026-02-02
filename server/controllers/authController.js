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

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const info = detectRoleAndDept(email);

        user = new User({
            name,
            email,
            password,
            role: info.role,
            department: info.dept,
            batchYear: info.year
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '10s' });

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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '10s' });

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
