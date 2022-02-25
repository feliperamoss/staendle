const express = require('express');
const router = express.Router({mergeParams: true});//toget params from other routes
const Product = require('../models/product');
const Store = require('../models/store');
const multer = require('multer');
const {storage} = require('../cloudinary/product');
const upload = multer({storage});
const {cloudinary} = require('../cloudinary');
const sanitizeHtml = require('sanitize-html');

//Render form
router.get('/new', async (req, res) => {
    const store = await Store.findById(req.params.id);
    res.render('products/new', {store});
})

//Create new product
router.post('/',upload.array('productImage'), async (req, res, next) => {
    try {
        const {id} =req.params
        const store = await Store.findById(id);
        const product = await new Product(req.body);
        product.images = req.files.map(f=> ({url: f.path, f: f.filename}))
        store.products.push(product);
        product.store = store;
        await store.save();
        await product.save();

        req.flash('sucess', 'Successfully added a product')
        res.redirect(`/stores/${id}`) 
    }
      catch(e) {
          next(e)
      }
})

//Show info about product

router.get('/:productId', async (req, res) => {
    const {id, productId} = req.params;
    const store = await Store.findById(id);
    const product = await Product.findById(productId);
    res.render('products/show', {product, store})
})

//Show form to edit product

router.get('/:productId/edit', async (req, res) => {
    const {id, productId} = req.params;
    const store = await Store.findById(id);
    const product = await Product.findById(productId); 
    res.render('products/edit', {product, store})
})

//Update Product

router.put('/:productId', upload.array('productImage'), async (req, res) => {
    const {id,productId} = req.params;
    for(let item in req.body) {
        const validate = sanitizeHtml(req.body[item], {
            allowedTags: [],
            allowedAttributes: {},
        })
        
        if(validate != req.body[item]) {
            req.flash('error', 'Cannot include HTML');
            return res.redirect(`/stores/${id}`)
        } 
    }
    const product = await Product.findByIdAndUpdate(productId, req.body);
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    product.images.push(...imgs);
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await product.save()

    req.flash('success', 'Successfully updated product');
    res.redirect(`/stores/${id}`)
})

//Delete route

router.delete('/:productId', async (req, res) => {
    const {id, productId} = req.params;
    await Product.findByIdAndDelete(productId);
    res.redirect(`/stores/${id}`)
})



module.exports = router;