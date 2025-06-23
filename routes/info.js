const express = require('express');
const router = express.Router(); // Create a new router instance

// Route for the About page
router.get('/about', (req, res) => {
    res.render('info/about',{title: 'about'}); // Renders views/info/about.ejs
});

// Route for the Help page
router.get('/help', (req, res) => {
    res.render('info/help',{title: 'help'}); // Renders views/info/help.ejs
});

// Route for the Terms page
router.get('/terms', (req, res) => {
    res.render('info/terms',{title: 'terms'}); // Renders views/info/terms.ejs
});

// Route for the Privacy page
router.get('/privacy', (req, res) => {
    res.render('info/privacy',{title: 'privacy'}); // Renders views/info/privacy.ejs
});

module.exports = router; // Export the router