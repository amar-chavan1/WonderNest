// controllers/listings.js
const Listing = require('../models/listing.js');
// IMPORT Cloudinary here from your cloudConfig.js
const { cloudinary } = require("../cloudConfig.js"); // This gets the configured cloudinary instance
const ExpressError = require('../utils/ExpressError'); // Assuming you have this utility for custom errors

module.exports.index = async (req, res) => {
    const selectedCategory = req.query.category;
    const searchQuery = req.query.q;
    
    let filter = {};

    // Apply category filter (if not 'all' or 'Trending')
    if (selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'Trending') {
        filter.category = selectedCategory;
    }

    // Apply search logic (title, location, country, or price)
    if (searchQuery) {
        const isNumeric = !isNaN(searchQuery);
        const regex = new RegExp(searchQuery, 'i');

        if (isNumeric) {
            filter.$or = [
                { title: regex },
                { location: regex },
                { country: regex },
                { price: parseInt(searchQuery) }
            ];
        } else {
            filter.$or = [
                { title: regex },
                { location: regex },
                { country: regex }
            ];
        }
    }

    const listings = await Listing.find(filter);

    res.render('listings/index.ejs', {
        listings,
        selectedCategory: selectedCategory || 'all',
        query: searchQuery || '',
        showSearch: true,
        title: 'All Listings' 
    });
};

// Render New Listing Form
module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs',{title: 'Add New Listing'});
}


// Show Single Listing
module.exports.showSingleListing = async (req, res, next) => {
    // Populate 'author' first, then 'reviews' which might also have an 'author' field (createdBy)
    let listing = await Listing.findById(req.params.id)
        .populate({path: 'reviews', populate: {path: 'createdBy'}}) // Assuming 'createdBy' is the author of the review
        .populate('author'); // Author of the listing

    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', { listing,title: 'Listing in detail'});
}


// Create New Listing
module.exports.createNewListing = async (req, res, next) => {
    // Check if an image file was uploaded
    // Your Mongoose schema marks image URL/filename as required, so this check is good practice.
    if (!req.file) {
        req.flash('error', 'Image is required to create a new listing.');
        return res.redirect('/listings/new'); // Redirect back to the form
    }
    
    // Create new listing from req.body.listing (which includes category, title, description, etc.)
    let newlisting = new Listing(req.body.listing);
    
    // Set the author of the new listing to the currently logged-in user's ID
    newlisting.author = req.user._id;

    // Assign Cloudinary image path and filename
    newlisting.image = {
        url: req.file.path,
        filename: req.file.filename
    };
    
    await newlisting.save();
    req.flash('success', 'New listing created successfully!');
    res.redirect('/listings');
}


// Render Edit Listing Form
module.exports.renderEditForm = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    res.render('listings/edit.ejs', { listing,title:'Edit Listing'});
}


// Update Listing
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    // Find and update the listing's basic fields (title, description, price, location, country, category)
    // { new: true } returns the updated document
    // { runValidators: true } runs Mongoose validators on update (e.g., category enum)
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });

    // Handle new image upload during update
    if (req.file) { // if a new file was uploaded by Multer
        // OPTIONAL: Delete the old image from Cloudinary
        // Check if there was an existing image and its filename is defined
        if (listing.image && listing.image.filename) {
            await cloudinary.uploader.destroy(listing.image.filename);
        }
        
        // Update the listing's image with the new Cloudinary details
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save(); // Save the listing again with the updated image
    }
    // If req.file is undefined, no new image was uploaded, so the existing listing.image remains unchanged
    // by the findByIdAndUpdate operation (since req.body.listing wouldn't contain image file data).

    req.flash('success', 'Listing Updated Successfully!');
    res.redirect(`/listings/${listing._id}`);
}


// Destroy Listing
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    
    // Find and delete the listing. The returned 'deletedListing' will contain the listing's data before deletion.
    let deletedListing = await Listing.findByIdAndDelete(id);

    // IMPORTANT: Delete the associated image from Cloudinary
    // Check if the deleted listing had an image and its filename is defined
    if (deletedListing && deletedListing.image && deletedListing.image.filename) {
        await cloudinary.uploader.destroy(deletedListing.image.filename);
    }
    
    // Your Mongoose middleware (post hook) should handle review deletion automatically.

    req.flash('success', 'Listing Deleted Successfully!');
    res.redirect('/listings');
}
