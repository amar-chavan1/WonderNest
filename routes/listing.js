// routes/listing.js
const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAuthor, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');

// IMPORTANT: Only import 'storage' for Multer here.
// The 'cloudinary' object for deletion is imported in the controller.
const { storage } = require('../cloudConfig.js'); 
const upload = multer({ storage }); // Initialize multer with the storage


router.route('/')
    .get(wrapAsync(listingController.index)) // Index route main page
    // POST route: isLoggedIn -> Multer (processes file) -> validateListing (validates req.body) -> createNewListing
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createNewListing)); 
    
router.get('/new', isLoggedIn, listingController.renderNewForm); // New listing adding route

router.route('/:id')
    .get(wrapAsync(listingController.showSingleListing)) // Show route for single listing
    // PUT route: isLoggedIn -> isAuthor -> Multer (processes new file) -> validateListing (validates updated req.body) -> updateListing
    .put(isLoggedIn, isAuthor, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing)) // <<<< ADDED validateListing HERE
    .delete(isLoggedIn, isAuthor, wrapAsync(listingController.destroyListing)); // Delete route for listing

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(listingController.renderEditForm)); // Edit listing route for getting the data to be edited

module.exports = router;