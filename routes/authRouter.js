const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { signupValidationRules, validateSignup } = require('../middleware/validateSignup');

router.get('/signup', authController.getSignupForm);
router.post('/signup', signupValidationRules, validateSignup, authController.signUp);

router.get('/login', authController.getLoginForm);
router.post('/login', authController.login);
router.post('/login/guest', authController.loginAsGuest);

router.get('/logout', authController.logOut);

module.exports = router;