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
const setupCronJobs = require('./utils/cronJobs');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(bodyParser.json());

app.use(
    expressSession({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000 // ms
        },
        secret: 'a santa at nasa',
        resave: false,
        saveUninitialized: false,
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

app.post('/set-view', (req, res) => {
    const { view } = req.body; // 'row' or 'box'
    if (view === 'row' || view === 'box') {
        req.session.viewPreference = view;
        res.status(200).json({ message: 'View preference saved' });
    } else {
        res.status(400).json({ error: 'Invalid view type' });
    }
});

// Route to get saved view preference
app.get('/get-view', (req, res) => {
    const viewPreference = req.session.viewPreference || 'row'; // Default to 'row' view if not set
    res.status(200).json({ view: viewPreference });
});

app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(passport.session());

app.use((req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.currentUser = req.user; // Set currentUser if authenticated
        next();
    } else {
        // Allow access to login and signup pages even if not authenticated
        if (req.path === '/login' || req.path === '/signup' || req.path === '/login/guest') {
            return next(); // Proceed to the login, signup, or guest login page
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


setupCronJobs();

app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});

// Error handling middleware
// Example:
// const error = new Error('You are not authorized to access this resource');
// error.status = 401; // Set the status code
// next(error);

app.use((err, req, res, next) => {
    if (err.status === 401) {
        // Handle 401 Unauthorized errors
        return res.status(401).render('404', { title: '404 - Unauthorized Access' });
    } else if (err.status) {
        // Handle other errors with defined status
        return res.status(err.status).render('error', { title: `${err.status} - Error`, message: err.message });
    }
    // For errors without a status, pass it to the default error handler
    next(err);
});

app.listen(3000, () => console.log("app listening on port 3000!"));

