if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require('path')
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const mongoSanitize = require('express-mongo-sanitize');

const ExpressError = require('./utils/ExpressError');
const Store = require('./models/store');
const User = require('./models/user.js');
const storesRoutes = require('./routes/stores')
const productsRoutes = require('./routes/products')
const userRoutes = require('./routes/users');
const checkoutRoutes = require('./routes/checkout');
const homeRoutes = require('./routes/home');

app.use(mongoSanitize({
    replaceWith: '_'
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//const dbUrl = process.env.DB_URL
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/practice'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const secret = process.env.SECRET || 'thisisasecret'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60, //24h, 60m, 60s session is updated one time in 24h
    crypto: {
        secret,
    },
});

store.on('error', function(e) {
    console.log('Session Store error', e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        htttpOnly: true,//these cookies are only accessable over http and not js
        secure:true, //means that the cookie should only work in https, does not work on localhost //uncomment that when deploy
        expires: Date.now() +1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));

//Passport settings
app.use.bind(passport.initialize());
app.use(passport.session()); //must be after the sessionConfig
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //put user in the session
passport.deserializeUser(User.deserializeUser()); //get user out of session

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    res.locals.shoppingCart = req.session.cart;
    next();
})

//Routes

app.use('/', userRoutes);
app.use('/', homeRoutes)
app.use('/stores', storesRoutes);
app.use('/stores/:id/products', productsRoutes);
app.use('/cart', checkoutRoutes);

app.get('/search', async (req, res) => {
    const city = req.query.q
    const stores = await Store.find({city: city})
    res.render("search", {stores})
})

//Page not found
app.all('*', (req, res, next) => {
    // res.render('pagenotfound')
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {status = 500} = err; //adds a default error 500 to status if the error is not what its in the class AppError
    if(!err.message) err.message = 'Something went wrong'
    res.status(status).render('error', {err})
})

const port = process.env.PORT || 3000;

app.listen(port, ()=> {
    console.log(`Server started on port ${port}`)
})