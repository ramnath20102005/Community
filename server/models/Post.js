const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['GENERAL', 'CLUB_UPDATE', 'JOB_POST', 'RESOURCE', 'EVENT', 'EXPERIENCE'],
        default: 'GENERAL'
    },
    image: {
        type: String, // Stores image as Base64 string
        default: null
    },
    images: [{
        type: String // Stores multiple images as Base64 strings
    }],
    attachments: [{
        name: String,
        url: String,
        fileType: String
    }],
    externalLinks: [{
        label: String, // e.g., "LeetCode", "Portfolio"
        url: String
    }],
    eventDate: {
        type: Date,
        default: null
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clubName: {
        type: String,
        default: null
    },
    // Job-specific fields
    companyName: {
        type: String,
        default: null
    },
    location: {
        type: String,
        default: null
    },
    externalLink: {
        type: String,
        default: null
    },
    salary: {
        type: String,
        default: null
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', postSchema);
