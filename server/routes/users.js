const express = require('express');
const router = express.Router();
const { getUsers, promoteToClubMember, demoteUser, updateProfile, getAlumni, triggerBackup } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/alumni', getAlumni); // Publicly viewable alumni directory

router.use(protect);

router.put('/profile', updateProfile);

// Admin only routes
router.use(authorize('ADMIN'));
router.get('/', getUsers);
router.post('/promote', promoteToClubMember);
router.post('/demote', demoteUser);
router.post('/backup', triggerBackup);

module.exports = router;
