if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ATLAS_URL = process.env.ATLAS_URL;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const listingrouter = require('./routes/listing.js');
const reviewrouter = require('./routes/review.js');
const userrouter = require('./routes/user.js');
const inforouter = require('./routes/info.js');
const flash = require('connect-flash');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user.js');
const Listing = require('./models/listing.js');
const { isLoggedIn } = require('./middleware.js');
const wrapAsync = require("./utils/wrapAsync.js");




// --- Database Connection ---
main()
    .then(() => console.log('Connected to MongoDB  ATLAS'))
    .catch(err => console.error('Error connecting to MongoDB:', err.message));
async function main() {
    mongoose.connect(ATLAS_URL);
}

// --- App Settings ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate); // EJS Mate engine setup

// --- Core Middleware ---
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(methodOverride('_method')); // Override HTTP methods


// --- mongo storesetup

const store = MongoStore.create({
    mongoUrl: ATLAS_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600 // time period in seconds to keep the session alive
});

store.on('error', (err) => {
    console.log(err);
});

// --- Session and Flash Middleware ---
const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7), // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};
app.use(expressSession(sessionOptions));
app.use(flash());


// --- Passport.js ---
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// --- Custom Middleware (res.locals) ---
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

// --- Route Handlers ---
app.get('/', async (req, res) => {
    let listings;
    const selectedCategory = req.query.category;

    if (selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'Trending') {
        listings = await Listing.find({ category: selectedCategory });
    } else {
        listings = await Listing.find({});
    }
    res.render('listings/index.ejs', { listings, selectedCategory: selectedCategory || 'all' });
});
app.use('/listings', listingrouter);
app.use('/listings/:id/reviews', reviewrouter);
app.use('/', userrouter);
app.use('/', inforouter);

app.get('/profile', isLoggedIn, wrapAsync(async (req, res) => {
    // Controller logic moved directly here
    if (!req.user) {
        req.flash('error', 'You must be logged in to view your profile.');
        return res.redirect('/login');
    }
    const userId = req.user._id;

    // Database query is here
    const userListings = await Listing.find({ author: userId });

    // Rendering the EJS template is here
    // Ensure this path matches your EJS file location: views/users/profile.ejs
    res.render('listings/profile.ejs', { currentUser: req.user, userListings });
}));


// --- 404 Not Found Handler ---
app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    // Check if the error is a Mongoose CastError (typically for invalid ID format)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        req.flash('error', 'Listing not found');
        // Redirect to a safe page (e.g., /listings)
        return res.redirect('/listings');
    }

    // For all other errors, use your existing error rendering logic
    let { status = 500, message = "Internal Server Error" } = err;
    res.render('listings/error.ejs', { status, message });
});


// --- Start Server ---
app.listen(8080, () => {
    console.log('Server is listening on http://localhost:8080');
});

// For testing on mobile (uncomment if needed)
// app.listen(3000, '0.0.0.0', () => {
//   console.log("Server running on http://0.0.0.0:3000");
// });
