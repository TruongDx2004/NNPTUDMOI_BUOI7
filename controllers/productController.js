const Product = require('../schemas/productSchema');

const productController = {
    create: async (req, res) => {
        try {
            const product = await Product.create(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAll: async (req, res) => {
        try {
            const products = await Product.find();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = productController;
