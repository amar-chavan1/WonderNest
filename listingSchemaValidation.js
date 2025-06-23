const Joi = require('joi');

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string()
            .required(),
        description: Joi.string()
            .required(),
        location: Joi.string()
            .required(),
        country: Joi.string()
            .required(),
        price: Joi.number()
            .required()
            .min(0),
        // CORRECTED: Image validation to match Mongoose schema (object with url and filename)
        image: Joi.object({
            url: Joi.string().required(),     // Assuming URL is required as per Mongoose schema
            filename: Joi.string().required() // Assuming filename is required
        }), // The image object itself is required for a listing

        // NEW: Category validation, matching the enum from your Mongoose model
        category: Joi.string().valid(
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
        ).required(), // Category is a required field
    }).required()
});

module.exports = { listingSchema };