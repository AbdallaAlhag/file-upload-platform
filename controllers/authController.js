const bcrypt = require('bcryptjs');
const passport = require('../config/passport');
const prisma = require('../db/prisma');


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
                filePath: '/', // File path for the root folder
                userId: newAccount.id, // Associate it with the newly created user
            },
        });

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
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err); // If there's an internal server error
        }
        if (!user) {
            // Authentication failed, display the error message from the `info` object
            return res.render('login', { errorMessage: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
};

exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/login');
    });
};