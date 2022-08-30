const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController');
const authController = require('../controllers/authController');

// Home Page
router.get('/', indexController.index);

// SignUp Page
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);

// Log In Page
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

module.exports = router;
