const Store = require('./models/store');
const Product = require('./models/product');


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl //the las url visited
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const {id} =req.params;
    const store = await Store.findById(id);
    if(!store.owner.equals(req.user._id)) {
        req.flash('error' , 'You do not have permission to do that');
        return res.redirect(`/stores/${id}`)
    }
    next();
}