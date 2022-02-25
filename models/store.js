const mongoose = require('mongoose');
const Product = require('./product');
const sanitizeHtml = require('sanitize-html');

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('upload', '/upload/w_200');
})

const opts = {toJSON: {virtuals: true}}; //to include virtuals in the object

const StoreSchema = new mongoose.Schema({
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
        required: true
    },
    street: {
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
        required: true
    },
    city: {
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
        required: true
    },
    zipcode: {
        type: Number,
        required: true
    },
    images: [ImageSchema],
    products: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Product'
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    soldProducts: [
        {
            product: {type: String},
            soldQty: {type: Number}
        }
    ]
});

StoreSchema.pre("save", function(next) {
    
    this.city =
    this.city.trim()[0].toUpperCase() + this.city.slice(1).toLowerCase();
      next();
    
  });

// const clean = (value) => {
//     const result = sanitizeHtml(value, {
//         allowedTags: [],
//         allowedAttributes: {},
//     })
//     if(result != value) {
//         return value = 'HTML'
//     } else {
//         return result;
//     }
// }
 
// StoreSchema.pre("save", async function() {
//     this.name = clean(this.name);
//     this.city = clean(this.city);
//     this.street = clean(this.street);
   
    
// });

module.exports = mongoose.model('Store', StoreSchema)