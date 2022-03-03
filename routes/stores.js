const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Store = require('../models/store');
const User = require('../models/user');
const {isLoggedIn, isOwner} = require('../middleware')
const multer = require('multer');
const {storage} = require('../cloudinary'); //node looks automactly for a index.js
//const upload = multer({dest: 'uploads/'}) //creates the folder uploads and upload the files in this folder
const upload = multer({storage});
const {cloudinary} = require('../cloudinary');
const sanitizeHtml = require('sanitize-html');

//Show all stores

router.get('/', async (req, res) => {
    const stores = await Store.find({})
    res.render('stores/index', {stores})
})

//Render form for new store
router.get('/new', isLoggedIn, (req, res) => {
    res.render('stores/new')
})

//Create Store

router.post('/', upload.array('image'), isLoggedIn, async (req, res, next) => {
    try{
        const store = await new Store(req.body);
        store.images= req.files.map(f => ({url: f.path, filename: f.filename}))
        store.owner = req.user._id;
        await store.save();
            
        req.flash('success', 'Successfully made a new campground!')
        res.redirect('/stores');
    } catch(e) {
        next(e)
    }
    
})


//Show store detail
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const store = await Store.findById(id).populate('products').populate('owner');
    console.log(store)
    if(!store) {
        req.flash('error', 'Cannot find that store.');
        return res.redirect('/stores')
    }
    res.render('stores/show', {store})
})

//Show edit form

router.get('/:id/edit', isLoggedIn, isOwner, async (req, res) => {
    const {id} = req.params;
    const store = await Store.findById(id)
    if(!store) {
        req.flash('error', 'Cannot find that store.')
        return res.redirect('/stores')
    }
    res.render('stores/edit', {store})
})

//edit store

router.put('/:id', upload.array('image'), isLoggedIn, isOwner, async (req, res) => {
    const {id} = req.params;
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
    
    const store = await Store.findByIdAndUpdate(id, req.body);
    const imgs = req.files.map(f=> ({url: f.path, filename: f.filename}));
    store.images.push(...imgs);
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await store.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    
    await store.save();
    req.flash('success', 'Successfully updated stander');
    res.redirect(`/stores/${id}`)
})

//Delete store

router.delete('/:id', isLoggedIn, isOwner, async (req, res) => {
    const {id} = req.params;
    await Store.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/stores')
})
module.exports = router;