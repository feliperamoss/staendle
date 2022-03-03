const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');

//Register form

router.get("/register", (req, res) => {
    res.render('users/register')
})

//Register user
router.post('/register', async (req, res, next) => {
    try{
        const {username, password, email} = req.body;
        const user = new User({username, email,});
        const registeredUser = await User.register(user, password); //hash the password, store the salt and hash password
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to E-St\u00E4ndle!');
            res.redirect('/stores')
        }); //login user after signup  
    } catch(e) {
        req.flash('error' , e.message);
        res.redirect('/register')
    }
})

//Show login form
router.get('/login', (req, res) => {
    res.render('users/login')
})

//Login
router.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/stores';
    delete req.session.returnTo; //deletes the object after
    res.redirect(redirectUrl);
})

//Logout

router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
})

module.exports = router;