const express = require('express');
const router = express.Router({mergeParams: true});//toget params from other routes
const Product = require('../models/product');
const Store = require('../models/store');
const {isLoggedIn} = require('../middleware');
const product = require('../models/product');
const store = require('../models/store');
const catchAsync = require('../utils/catchAsync');

//Add product to cart

router.post('/stores/:id/products/:productId', catchAsync(async (req, res) => {
    const {id, productId} = req.params;
    const qty = Number(req.body.buyQty)
    const product = await Product.findById(productId)
    
    
    if (req.session.cart) {
        req.session.cart.length;
    } else {
         req.session.cart = [];
    }
    


    const checkProduct = req.session.cart.findIndex(obj => obj.product._id == product._id)

    if(checkProduct === -1) {
        req.session.cart.push({
            buyQty: qty,  
            product
        });
    }
    
    if(checkProduct !== -1) {
        for(let item of req.session.cart) {
            if(product._id == item.product._id) {   
                item.buyQty += qty
            } 
        }
    }
    
    req.flash('success', 'Product added to cart.')
    res.redirect(`/stores/${id}`)
}))

//Show shopping cart

router.get('/', (req, res) => { 
    res.render('payment/shoppingCart')
})

//Update qty

router.put('/:productId/update', (req, res) => {
    const {productId} = req.params
    const newQty = Number(req.body.qty)
    for(let item of req.session.cart) {
        if(productId == item.product._id) {   
           item.buyQty = newQty
           
        } 
    }
    
    return res.redirect('/cart')
})

//Delete item from cart

router.delete('/:productId/delete', (req, res) => {
    const {productId} = req.params
    for(let item of req.session.cart) {
        if(productId == item.product._id) {   
            const productIndex = req.session.cart.indexOf(item);
            if(productIndex > -1) {
                req.session.cart.splice(productIndex, 1)
            }
        } 
    }
    if(req.session.cart.length !== 0) {
        return res.redirect('/cart')
    }
    res.redirect('/stores')
})

//Add product to buy now
router.post('/products/:productId', catchAsync(async (req, res) => {
    const {id, productId} = req.params;
    const qty = Number(req.body.buyQty)
    const product = await Product.findById(productId)

    const checkProduct = req.session.cart.findIndex(obj => obj.product._id == product._id)

    if(checkProduct === -1) {
        req.session.cart.push({
            buyQty: qty,  
            product
        });
    }
    
    if(checkProduct !== -1) {
        for(let item of req.session.cart) {
            if(product._id == item.product._id) {   
                item.buyQty += qty
            } 
        }
    }
    
    
    res.redirect(`/cart/checkout`)
    
}))

//Show checkout

router.get('/checkout', isLoggedIn, (req, res) => {
    res.render('payment/checkout')
})

//Show checkout

router.post('/checkout', isLoggedIn, catchAsync(async (req, res) => {
    // const ids = [];
    // const qty = [];

    //Update product quantity in stock and adds to store sold products array
    for(let item of req.session.cart) {
        // ids.push( item.product._id)
        // qty.push(item.buyQty)
        const product = await Product.findByIdAndUpdate(item.product._id, {inStock: item.product.inStock - item.buyQty});
        const store = await Store.findById(item.product.store);
        store.soldProducts.push({product: item.name, soldQty: item.buyQty});
        await product.save()
        await store.save()
    }

    //Delete product if product is not in stock
    for(let i of req.session.cart) {
        const ware = await Product.findById(i.product._id)
            if(ware.inStock === 0) {
                await Product.findByIdAndDelete(ware._id);
        }
        
    }
    req.flash('success', 'We have received your order.')
    req.session.cart = [];
    
    res.redirect('/stores')
}))


module.exports = router;