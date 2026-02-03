const express = require('express');
const router = express.Router();
const { 
    getPosts, getPostById, createPost, updatePost, deletePost, likePost,
    applyToJob, getJobApplications 
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/apply', protect, applyToJob);
router.get('/:id/applications', protect, getJobApplications);

module.exports = router;
