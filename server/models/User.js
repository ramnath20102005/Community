const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['STUDENT', 'ALUMNI', 'ADMIN'],
        default: 'STUDENT'
    },
    // Sub-role status
    isClubMember: {
        type: Boolean,
        default: false
    },
    clubName: {
        type: String,
        default: null
    },
    position: {
        type: String,
        default: null
    },
    department: {
        type: String,
        trim: true
    },
    batchYear: {
        type: Number
    },
    // New Profile Fields
    company: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    linkedIn: {
        type: String,
        default: ""
    },
    profileImage: {
        type: String, // Stores profile photo as Base64 string
        default: ""
    },
    contactEmail: {
        type: String,
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
