const Store = require('./models/store');
const Product = require('./models/product');


module.exports.isLoggedIn = (req, res, next) => {
    // console.log("User...", req.user)
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
        req.flash('error' , 'You do not have permission to do that"');
        return res.redirect(`/stores/${id}`)
    }
    next();
}


// module.exports.cartSession = async(req, res, next) => {
//     const {id, productId} = req.params;
//     const product = await Product.findById(productId)
//     if(req.session.cart.length === 0) {
//         req.session.cart.push({
//             buyQty: Number(req.body.buyQty),  
//             product
//         })
//     } else {
//         for(let item of req.session.cart) {
//             if(product._id === item.product._id) {   
//              item.buyQty += Number(req.body.buyQty)
                
            
//             } 
//             else{
//                  req.session.cart.push({
//                     buyQty: Number(req.body.buyQty),  
//                     product
//                 });
                
//             }
//         }
//     }
//     next()
// }

// module.exports.validateStore= (req, res, next) => {
//     const {error} = campgroundSchema.validate(req.body);
//     if(error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400);
//     } else{
//         next()
//     }
// }