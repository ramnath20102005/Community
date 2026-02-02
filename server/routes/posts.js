const express = require('express');
const router = express.Router();
const { getPosts, getPostById, createPost, updatePost, deletePost, likePost } = require('../controllers/postController');
const { protect } = require('../middleware/auth');

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);

module.exports = router;
