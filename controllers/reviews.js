const Listing = require('../models/listing.js');
const Review = require('../models/review.js');

module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id).populate('reviews');
    let review = new Review(req.body.review);
    listing.reviews.push(review);
    review.createdBy = req.user._id;
    await review.save();
    await listing.save();
    req.flash('success', 'Review Added Successfully!');
    res.redirect(`/listings/${listing._id}`);

}

module.exports.destroyReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let review = await Review.findByIdAndDelete(req.params.reviewId);
    listing.reviews.pull(review);
    await listing.save();
    req.flash('success', 'Review Deleted Successfully!');
    res.redirect(`/listings/${listing._id}`);
}
