const Post = require('../models/Post');

// Get all posts
exports.getPosts = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};

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

        // Logic for Club Post: Ensure user is authorized
        if (type === 'CLUB_UPDATE' && !req.user.isClubMember && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Only club members can post club updates" });
        }

        // Logic for Job/Event Post: Ensure Alumni or Admin
        if ((type === 'JOB_POST' || type === 'EVENT') && req.user.role === 'STUDENT' && !req.user.isAdmin) {
            return res.status(403).json({ message: `Only alumni can post ${type.toLowerCase()}s` });
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
