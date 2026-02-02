const User = require('../models/User');

// Get all users (Admin only)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Promote to Club Member (Admin only)
exports.promoteToClubMember = async (req, res) => {
    try {
        const { userId, clubName, position } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isClubMember = true;
        user.clubName = clubName;
        user.position = position || "Member";

        await user.save();
        res.json({ message: `User promoted to Club Member of ${clubName}`, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, company, location, bio, linkedIn, profileImage } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (company !== undefined) user.company = company;
        if (location !== undefined) user.location = location;
        if (bio !== undefined) user.bio = bio;
        if (linkedIn !== undefined) user.linkedIn = linkedIn;
        if (profileImage !== undefined) user.profileImage = profileImage;

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                location: user.location,
                bio: user.bio,
                linkedIn: user.linkedIn,
                profileImage: user.profileImage,
                isClubMember: user.isClubMember
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get All Alumni (Publicly visible)
exports.getAlumni = async (req, res) => {
    try {
        const alumni = await User.find({ role: 'ALUMNI' })
            .select('name email department batchYear company position location bio linkedIn profileImage');
        res.json(alumni);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const { performBackup } = require('../utils/backup');

// Demote from Club Member (Admin only)
exports.demoteUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isClubMember = false;
        user.clubName = null;
        user.position = null;

        await user.save();
        res.json({ message: "User demoted to regular student", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Trigger Manual Backup (Admin only)
exports.triggerBackup = async (req, res) => {
    try {
        await performBackup();
        res.json({ message: "Database backup initiated successfully. Check server/backups/ directory." });
    } catch (err) {
        res.status(500).json({ message: "Backup failed: " + err.message });
    }
};
