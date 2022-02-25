const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/practice', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const productSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

const productSeed = async() => {
    await Product.deleteMany({});
    const product = new Product({
        name: "apple",
        price: 1.00,
        category: "fruit"
    })
    await product.save();
}

// productSeed().then(()=> {
//     mongoose.connection.close();
// })


const StoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zipcode: {
        type: Number,
        required: true
    }    
});

const Store = mongoose.model('Store', StoreSchema)

const storeSeed = async() => {
    await Store.deleteMany({});
    const store = new Store({
        name: 'Endersbach Ständle',
        street: 'Strümpfelbacher Str. 10',
        city: 'Weinstadt',
        zipcode: 71384
    })
    await store.save();
}

storeSeed().then(()=> {
    mongoose.connection.close();
})