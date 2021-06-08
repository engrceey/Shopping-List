const mongoose = require('mongoose');
const ListSchema = new mongoose.Schema ({

    productName: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    description: String,
    price: Number,

    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('ShoppingList', ListSchema )