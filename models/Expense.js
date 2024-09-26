const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    description: { 
        type: String, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    paymentMethod: { 
        type: String, 
        enum: ['cash', 'credit'], 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date 
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);