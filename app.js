/////// app.js
const express = require("express");
const path = require('path');
const passport = require("passport");
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const authRouter = require('./routes/authRouter');
const appRouter = require('./routes/appRouter');
const uploadRouter = require('./routes/uploadRouter');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(
    expressSession({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000 // ms
        },
        secret: 'a santa at nasa',
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(
            new PrismaClient(),
            {
                checkPeriod: 2 * 60 * 1000,  //ms
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        )
    })
);

app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.session());

app.use((req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.currentUser = req.user; // Set currentUser if authenticated
        next();
    } else {
        // Allow access to login and signup pages even if not authenticated
        if (req.path === '/login' || req.path === '/signup') {
            return next(); // Proceed to the login or signup page
        }
        // Redirect to login page if not authenticated and trying to access other routes
        return res.redirect('/login');
    }
});

// The following code is for handling graceful shutdowns of the server
// We use these events to disconnect from the database before the process exits
// This is important because Prisma will otherwise throw an error when the process
// is killed, as it will not be able to properly disconnect from the database.

// Handle SIGINT (e.g. Ctrl+C in the terminal)
process.on('SIGINT', async () => {
    console.log('Received SIGINT, disconnecting from database');
    await prisma.$disconnect();
    process.exit(0);
});

// Handle SIGTERM (e.g. kill command in the terminal)
process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, disconnecting from database');
    await prisma.$disconnect();
    process.exit(0);
});

app.use('/uploads', express.static('uploads')); // Serve static files from 'uploads' directory
app.use('/', uploadRouter); // Route for handling file uploads
app.use('/', appRouter);
app.use('/', authRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));

