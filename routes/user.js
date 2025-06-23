const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const userController = require('../controllers/users.js');

router.route('/register')
    .get(userController.renderRegisterForm) // New registration (signup) form
    .post(wrapAsync(userController.register)); // Handle user registration

router.route('/login')
    .get(userController.renderLoginForm) // New login form
    .post(passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login',
        keepSessionInfo: true
    }), userController.login); // Handle user login

router.get('/logout', userController.logout); // Logout

module.exports = router;