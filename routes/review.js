const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn, validateReview, isReviewCreator } = require('../middleware.js');
const reviewController = require('../controllers/reviews.js');

router.route('/')
    .post(isLoggedIn, validateReview, wrapAsync(reviewController.createReview)); // Add review

router.route('/:reviewId')
    .delete(isLoggedIn, isReviewCreator, wrapAsync(reviewController.destroyReview)); // Delete review

module.exports = router;