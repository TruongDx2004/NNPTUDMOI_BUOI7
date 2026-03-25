const Inventory = require('../schemas/inventorySchema');
require('../schemas/productSchema'); // Ensure product model is registered

const inventoryController = {
    // lấy tất cả
    getAll: async (req, res) => {
        try {
            const inventories = await Inventory.find().populate('product');
            res.status(200).json(inventories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // lất inventory by ID
    getById: async (req, res) => {
        try {
            const inventory = await Inventory.findById(req.params.id).populate('product');
            if (!inventory) {
                return res.status(404).json({ message: 'Khong tim thay inventory' });
            }
            res.status(200).json(inventory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // tăng stock tương ứng với quantity
    addStock: async (req, res) => {
        const { product, quantity } = req.body;
        try {
            const inventory = await Inventory.findOneAndUpdate(
                { product },
                { $inc: { stock: quantity } },
                { new: true, runValidators: true }
            );
            if (!inventory) {
                return res.status(404).json({ message: 'Khong tim thay inventory' });
            }
            res.status(200).json(inventory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // giảm stock tương ứng với quantity
    removeStock: async (req, res) => {
        const { product, quantity } = req.body;
        try {
            const inventory = await Inventory.findOneAndUpdate(
                { product, stock: { $gte: quantity } },
                { $inc: { stock: -quantity } },
                { new: true, runValidators: true }
            );
            if (!inventory) {
                return res.status(400).json({ message: 'Khong tim thay inventory' });
            }
            res.status(200).json(inventory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Giảm stock và tăng reserved tương ứng với quantity
    reservation: async (req, res) => {
        const { product, quantity } = req.body;
        try {
            const inventory = await Inventory.findOneAndUpdate(
                { product, stock: { $gte: quantity } },
                { 
                    $inc: { 
                        stock: -quantity,
                        reserved: quantity
                    } 
                },
                { new: true, runValidators: true }
            );
            if (!inventory) {
                return res.status(400).json({ message: 'Khong tim thay inventory' });
            }
            res.status(200).json(inventory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Giảm reservation và tăng soldCount tương ứng với quantity
    sold: async (req, res) => {
        const { product, quantity } = req.body;
        try {
            const inventory = await Inventory.findOneAndUpdate(
                { product, reserved: { $gte: quantity } },
                { 
                    $inc: { 
                        reserved: -quantity,
                        soldCount: quantity
                    } 
                },
                { new: true, runValidators: true }
            );
            if (!inventory) {
                return res.status(400).json({ message: 'Khong tim thay inventory' });
            }
            res.status(200).json(inventory);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = inventoryController;
