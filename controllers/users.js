const User = require('../models/user');


module.exports.renderRegisterForm=(req,res)=>{
    res.render('users/signup.ejs',{title: 'Signup'});
}


module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        
        // Auto-login after registration
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to WanderNest!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}


module.exports.renderLoginForm=(req, res) => {
    res.render('users/login.ejs',{title: 'Login'});
}


module.exports.login=(req, res) => {
    req.flash('success', 'Welcome back!');
    
    // Get the stored return URL and method
    const redirectUrl = req.session.returnTo || '/listings';
    const requestMethod = req.session.returnMethod;
    
    // Clean up session variables
    delete req.session.returnTo;
    delete req.session.returnMethod;
    
    // If the original request was a POST, PUT, or DELETE for reviews
    if (requestMethod && ['POST', 'PUT', 'DELETE'].includes(requestMethod) && 
        redirectUrl.includes('/reviews')) {
        
        // Extract the listing ID from the URL
        // Assuming URLs like /listings/:id/reviews or /listings/:id/reviews/:reviewId
        const urlParts = redirectUrl.split('/');
        const listingIndex = urlParts.indexOf('listings');
        
        if (listingIndex !== -1 && listingIndex + 1 < urlParts.length) {
            // Redirect to the listing page instead
            return res.redirect(`/listings/${urlParts[listingIndex + 1]}`);
        }
    }
    
    // For normal GET requests or if we couldn't parse the URL
    res.redirect(redirectUrl);
}


module.exports.logout=(req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'You have been logged out.');
        res.redirect('/listings');
    });
}