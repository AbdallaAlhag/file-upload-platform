const bcrypt = require('bcryptjs');
const passport = require('../config/passport');
const prisma = require('../db/prisma');
const supabase = require('../db/supabaseClient');


exports.getSignupForm = (req, res) => {
    res.render('signup', { errors: {}, data: {} });
};

exports.getLoginForm = (req, res) => {
    res.render('login', { errorMessage: '' });
}
exports.signUp = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newAccount = await prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            },
        });

        console.log('New account created:', newAccount);
        // Create the root folder for the user
        const rootFolder = await prisma.folder.create({
            data: {
                name: 'root', // The root folder name
                filePath: '/root', // File path for the root folder
                userId: newAccount.id, // Associate it with the newly created user
            },
        });
        // Create the user in Supabase
        const { user, error: supabaseError } = await supabase.auth.signUp({
            email: req.body.email,
            password: req.body.password,
        });

        if (supabaseError) {
            console.error('Supabase sign up error:', supabaseError);
            return res.redirect('/signup');
        }

        console.log('New account created:', newAccount);
        res.redirect('/login');
    } catch (err) {
        next(err);
        res.redirect('/signup');
    }
};
// // basic login
// exports.login = (req, res, next) => {
//     passport.authenticate("local", {
//         successRedirect: "/",
//         failureRedirect: "/"
//     })(req, res, next)
//     // don't know if i need (req,res, next) but it works
// }

exports.login = (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return next(err); // If there's an internal server error
        }
        if (!user) {
            // Authentication failed, display the error message from the `info` object
            return res.render('login', { errorMessage: info.message });
        }
        req.logIn(user, async (err) => {
            if (err) {
                return next(err);
            }
            // Here, you can now authenticate with Supabase
            // For example, you can get the user's access token
            const { data: { session }, error } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: req.body.password, // Use the password to authenticate with Supabase
            });

            if (error) {
                console.error('Supabase authentication error:', error);
                return res.redirect('/login');
            }

            // Store Supabase session data if needed
            req.session.supabaseAccessToken = session.access_token; // Store the access token

            return res.redirect('/');
        });
    })(req, res, next);
};
exports.loginAsGuest = (req, res, next) => {
    // Set guest credentials in the request body
    req.body.username = 'guest';
    req.body.password = 'guestguest';

    // Use passport's local strategy for authentication
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return next(err); // Handle internal server error
        }
        if (!user) {
            // Authentication failed, return a JSON error response
            return res.status(401).json({ error: info.message });
        }

        req.logIn(user, async (err) => {
            if (err) {
                console.error('Login error:', err); // Log any errors
                return next(err);
            }
            const { data: { session }, error } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: req.body.password, // Use the password to authenticate with Supabase
            });


            if (error) {
                console.error('Supabase authentication error:', error);
                return res.redirect('/login');
            }

            // // Store Supabase session data if needed
            req.session.supabaseAccessToken = session.access_token;
            req.session.supabaseRefreshToken = session.refresh_token;
            console.log('Access Token:', req.session.supabaseAccessToken);
            console.log('Refresh Token:', req.session.supabaseRefreshToken);

            // Set the access token using setSession
            const { data: userSession, error: sessionError } = await supabase.auth.setSession({
                access_token: req.session.supabaseAccessToken,
                refresh_token: req.session.supabaseRefreshToken,
            });

            if (sessionError) {
                console.error('Error setting Supabase session:', sessionError);
                return res.status(401).send('User not authenticated');
            }

            return res.status(200).json({ message: 'Logged in as guest' });
        });
    })(req, res, next);
};

exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/login');
    });
};