const bcrypt = require('bcryptjs');
const passport = require('../config/passport');
const prisma = require('../db/prisma');


exports.getSignupForm = (req, res) => {
    res.render('signup');
};

exports.getLoginForm = (req, res) => {
    res.render('login');
}
exports.signUp = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            },
        });
        res.redirect('/');
    } catch (err) {
        next(err);
    }
};

// basic login
exports.login = (req, res, next) => {
    console.log('logging in');
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    })(req, res, next)
    // don't know if i need (req,res, next) but it works
}

exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
};