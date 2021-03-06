const express = require('express');
const router = express.Router({mergeParams: true});//toget params from other routes
const Product = require('../models/product');
const Store = require('../models/store');

//Home
router.get('/', (req, res) => {
    // const products = await Product.find({}).populate('store')
    res.render('home/home') 
})

router.post('/', (req, res) => {
    const citySearch = req.body.searchStore
    const city = citySearch.trim().toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
    res.redirect(`/search?q=${city}`) 
})

module.exports = router