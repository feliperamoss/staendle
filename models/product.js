const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');

const ProductImageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

ProductImageSchema.virtual('productThumbnail').get(function() {
    return this.url.replace('upload', '/upload/w_200');
})

const ProductSchema = new mongoose.Schema( {
    name: {
        type: String,
        validate: {
            validator: function(value) {
                
                const validation = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                })
                if(validation != value) {
                return false
                } else {
                    return true;
                }
            },
            message: props => `Must not include html!`
          },
        required: true,
    },
    description: {
        type: String,
        validate: {
            validator: function(value) {
                
                const validation = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                })
                if(validation != value) {
                return false
                } else {
                    return true;
                }
            },
            message: props => `Must not include html!`
          },
        required: true,
    },
    images: [ProductImageSchema],
    price: {
        type: Number,
        min: 0.01,
        required: true
    },
    unity: {
        type: String,
        enum: ['Kg', 'Un'],
        required: true
    },
    inStock: {
        type: Number,
        min: 1,
        required: true,
    },
    category: {
        type: String,
        enum: ['fruit', 'vegetable', 'other'],
        required: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Store'
    }
});

module.exports = mongoose.model('Product', ProductSchema);
