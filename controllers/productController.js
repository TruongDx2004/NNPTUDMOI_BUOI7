const Product = require('../schemas/productSchema');

const productController = {
    create: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const product = await Product.create([req.body], { session });

            await Inventory.create([{
                product: product[0]._id
            }], { session });

            await session.commitTransaction();
            session.endSession();

            res.status(201).json(product[0]);

        } catch (error) {
            await session.abortTransaction();
            session.endSession();

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
