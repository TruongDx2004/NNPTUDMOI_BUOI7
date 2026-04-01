const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String
}, { timestamps: true });

productSchema.post('save', async function(doc, next) {
    try {
        const Inventory = mongoose.model('inventory');
        await Inventory.create({
            product: doc._id,
            stock: 0,
            reserved: 0,
            soldCount: 0
        });
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('product', productSchema);
