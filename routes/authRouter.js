const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { signupValidationRules, validateSignup } = require('../middleware/validateSignup');

// haven't created authController yet
router.get('/signup', authController.getSignupForm);
router.post('/signup', signupValidationRules, validateSignup, authController.signUp);

router.get('/login', authController.getLoginForm);
router.post('/login', authController.login);

router.get('/logout', authController.logOut);

module.exports = router;