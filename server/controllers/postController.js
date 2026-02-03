const Post = require('../models/Post');
const JobApplication = require('../models/JobApplication');
const { validateContent } = require('../utils/moderator');

// Get all posts with auto-cleanup of expired ones
exports.getPosts = async (req, res) => {
    try {
        const now = new Date();

        // Auto-delete expired events/posts
        // Any post with an eventDate in the past
        const expiredPosts = await Post.find({
            eventDate: { $ne: null, $lt: now }
        });

        if (expiredPosts.length > 0) {
            console.log(`[Auto-Cleanup] Deleting ${expiredPosts.length} expired posts/events`);
            await Post.deleteMany({
                _id: { $in: expiredPosts.map(p => p._id) }
            });
        }

        const { type } = req.query;
        let filter = {};
        if (type && type !== 'ALL') {
            if (type === 'EVENTS') filter = { type: 'EVENT' };
            else if (type === 'JOBS') filter = { type: 'JOB_POST' };
            else filter = { type };
        }

        const posts = await Post.find(filter)
            .populate('author', 'name email role position clubName')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single post
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name email role position clubName');
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a post
exports.createPost = async (req, res) => {
    try {
        const {
            title, content, type, companyName, location, externalLink,
            salary, images, attachments, externalLinks
        } = req.body;

        // Image Requirement Check
        if (!req.body.image && (!images || images.length === 0)) {
            return res.status(400).json({ message: "Visual context (images) is mandatory for all community publications." });
        }

        // Content Moderation Check
        const titleScan = validateContent(title);
        if (!titleScan.isSafe) {
            return res.status(400).json({ message: `Inappropriate Title: ${titleScan.reason}` });
        }

        const contentScan = validateContent(content);
        if (!contentScan.isSafe) {
            return res.status(400).json({ message: `Inappropriate Content: ${contentScan.reason}` });
        }

        // Deep Scan for Job specific fields
        if (type === 'JOB_POST') {
            const companyScan = validateContent(companyName);
            if (!companyScan.isSafe) return res.status(400).json({ message: `Inappropriate Company Name: ${companyScan.reason}` });

            const locationScan = validateContent(location);
            if (!locationScan.isSafe) return res.status(400).json({ message: `Inappropriate Location: ${locationScan.reason}` });
        }

        // Logic for Club Post: Ensure user is authorized
        if (type === 'CLUB_UPDATE' && !req.user.isClubMember && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Only club members can post club updates" });
        }

        // Logic for Event Post: Ensure Alumni, Admin, or Club Member
        if (type === 'EVENT') {
            const isAuthorized = req.user.role === 'ALUMNI' || req.user.role === 'ADMIN' || req.user.isClubMember;
            if (!isAuthorized) {
                return res.status(403).json({ message: "Only alumni, admins, or club members can post events" });
            }
        }

        // Logic for Job Post: Ensure Alumni or Admin
        if (type === 'JOB_POST' && req.user.role === 'STUDENT' && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Only alumni can post jobs" });
        }

        const post = new Post({
            title,
            content,
            type,
            image: req.body.image || null,
            images: images || [],
            attachments: attachments || [],
            externalLinks: externalLinks || [],
            author: req.user._id,
            clubName: req.user.clubName,
            companyName: type === 'JOB_POST' ? companyName : null,
            location: (type === 'JOB_POST' || type === 'EVENT') ? location : null,
            externalLink: (type === 'JOB_POST' || type === 'EVENT') ? externalLink : null,
            salary: type === 'JOB_POST' ? salary : null,
            eventDate: type === 'EVENT' ? req.body.eventDate : null
        });

        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Check if user is author or admin
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Unauthorized to update this post" });
        }

        // Content Moderation Check for Updates
        if (req.body.title) {
            const titleScan = validateContent(req.body.title);
            if (!titleScan.isSafe) {
                return res.status(400).json({ message: `Inappropriate Title: ${titleScan.reason}` });
            }
        }

        if (req.body.content) {
            const contentScan = validateContent(req.body.content);
            if (!contentScan.isSafe) {
                return res.status(400).json({ message: `Inappropriate Content: ${contentScan.reason}` });
            }
        }

        // Update fields
        const updateFields = [
            'title', 'content', 'type', 'image', 'images',
            'attachments', 'externalLinks', 'companyName',
            'location', 'externalLink', 'salary', 'eventDate'
        ];

        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                post[field] = req.body[field];
            }
        });

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Check if user is author or admin
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        await Post.deleteOne({ _id: req.params.id });
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Interaction: Like
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const index = post.likes.indexOf(req.user._id);
        if (index === -1) {
            post.likes.push(req.user._id);
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Apply to a job
exports.applyToJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Post.findById(id);

        if (!job || job.type !== 'JOB_POST') {
            return res.status(404).json({ message: "Job posting not found" });
        }

        // Only students can apply
        if (req.user.role !== 'STUDENT') {
            return res.status(403).json({ message: "Only students can express interest in job postings." });
        }

        // Prevent duplicate applications
        const existingApplication = await JobApplication.findOne({
            jobId: id,
            studentId: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this position." });
        }

        const applicationData = {
            jobId: id,
            studentId: req.user._id,
            alumniId: job.author,
            name: req.body.name,
            email: req.user.email,
            department: req.body.department,
            batch: req.body.batch,
            phone: req.body.phone,
            resumeUrl: req.body.resumeUrl,
            message: req.body.message
        };

        const application = new JobApplication(applicationData);
        await application.save();

        res.status(201).json({ message: "Application submitted successfully!", application });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get applications for a job (Alumni/Admin only)
exports.getJobApplications = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Post.findById(id);

        if (!job) return res.status(404).json({ message: "Job posting not found" });

        // Authorization check: Only author or admin
        if (job.author.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Unauthorized to view applications" });
        }

        const applications = await JobApplication.find({ jobId: id })
            .sort({ createdAt: -1 })
            .populate('studentId', 'name email department batchYear profileImage');

        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
