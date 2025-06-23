const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require('./listingSchemaValidation.js');
const { reviewSchema } =require('./reviewSchemaValidation.js')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Store the original URL and method
        req.session.returnTo = req.originalUrl;
        req.session.returnMethod = req.method;
        
        req.flash('error', 'You must be logged in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params; // Get listing ID from URL parameters
    const listing = await Listing.findById(id); // Find the listing
    // Check if the logged-in user's ID matches the listing's author ID
    // req.user._id is a Mongoose ObjectId, listing.author is also an ObjectId.
    // Use .equals() for comparison as direct === can fail.
    if (!listing.author.equals(req.user._id)) {
        req.flash('error', 'You are not the owner of this listing.');
        return res.redirect(`/listings/${id}`); // Redirect back to the listing show page
    }
    next(); // If the user is the author, proceed to the next middleware/route handler
};


//listing validation middleware for the new and edit routes
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errorMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, errorMsg);
    } else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errorMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, errorMsg);
    } else {
        next();
    }
};

module.exports.isReviewCreator = async (req, res, next) => {
    const { reviewId, id } = req.params; 
    const review = await Review.findById(reviewId);
    
    if (!review.createdBy.equals(req.user._id)) {
        req.flash('error', 'You are not the author of this review.');
        return res.redirect(`/listings/${id}`); 
    }
    next(); 
};  

