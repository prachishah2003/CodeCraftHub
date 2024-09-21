const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define API routes for user registration, login, and profile management
router.post('/register', userController.registerUser); // Route for user registration
router.post('/login', userController.loginUser); // Route for user login
router.put('/:username', userController.updateUserProfile); // Route for updating user profile

module.exports = router;