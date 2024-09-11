const bcrypt = require('bcryptjs');
const passport = require('passport');
const prisma = require('./prisma');


exports.getSignupForm = (req, res) => {
    res.render('sign-up');
};

exports.signUp = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await prisma.user.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                password: hashedPassword,
            },
        });
        res.redirect('/');
    } catch (err) {
        next(err);
    }
};

