const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review'); // Corrected variable name from 'review' to 'Review' for consistency

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        }
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        enum: [
            'Trending',        // Popular/Curated homes
            'Rooms',           // Private rooms or shared spaces
            'Mountain',        // Homes in mountainous regions
            'Pools',           // Homes with amazing pools
            'Beachfront',      // Homes directly on or very near the beach
            'Cabins',          // Cozy, rustic cabins
            'Castles',         // Unique castle stays
            'Camping',         // Campsites, tents, glamping
            'Farms',           // Farm stays or rural retreats
            'Arctic',          // Homes in cold, snowy environments
            'Domes',           // Dome-shaped unique stays
            'Boats',           // Houseboats, yachts, unique water stays
            'Ski-in/out',      // Direct access to ski slopes
            'Treehouses',      // Elevated homes in trees
            'Tiny homes',      // Small, minimalist dwellings
            'Lux',             // Luxury properties
            'A-frames',        // A-frame shaped houses
            'Lakefront',       // Homes by lakes
            'Desert',          // Desert retreats
            'Islands',         // Private island homes or remote island stays
            'Historical homes' // Properties with historical significance
        ],
        required: true,
        default: 'Trending' // Set a reasonable default category
    },
})

// Middleware to delete reviews when listing is deleted
// IMPORTANT: Corrected `review` to `Review` to match your schema ref
listingSchema.post('findOneAndDelete', async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;