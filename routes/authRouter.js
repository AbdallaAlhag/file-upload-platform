const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// haven't created authController yet
router.get('/signup', (req, res) => res.render("sign-up-form"));
router.post('/signup', async (req, res, next) => {
    try {
        await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
            req.body.username,
            req.body.password,
        ]);
        res.redirect("/");
    } catch (err) {
        return next(err);
    }
});


module.exports = router;