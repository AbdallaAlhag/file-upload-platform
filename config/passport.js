const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            // Find user by username using Prisma
            const user = await prisma.user.findUnique({
                where: { username: username },
            });

            // If user is not found
            if (!user) return done(null, false, { message: 'Incorrect username' });

            // Compare the password with the hashed password stored in the database
            const match = await bcrypt.compare(password, user.password);

            // If password does not match
            if (!match) return done(null, false, { message: 'Incorrect password' });

            // If everything is fine, return the user
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id); // Serialize user by ID
});

passport.deserializeUser(async (id, done) => {
    try {
        // Find user by ID using Prisma
        const user = await prisma.user.findUnique({
            where: { id: id },
        });

        if (!user) return done(null, false); // If no user found

        done(null, user); // If found, pass the user to the next middleware
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
