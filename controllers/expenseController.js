const Expense = require('../models/Expense');
const parseCSV = require('../utils/csvParser');

const uploadCSV = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const expenses = await parseCSV(req.file.path);

        // Example mapping CSV rows to Expense schema, adjust based on your CSV format
        const newExpenses = expenses.map((item) => ({
            description: item.description,
            amount: parseFloat(item.amount),
            category: item.category,
            paymentMethod: item.paymentMethod.toLowerCase() === 'cash' ? 'cash' : 'credit',
            createdAt: item.createdAt ? new Date(item.createdAt) : Date.now(),
        }));

        await Expense.insertMany(newExpenses);

        res.status(201).json({ message: 'CSV file successfully processed', newExpenses });
    } catch (error) {
        res.status(500).json({ message: 'Error processing CSV file', error });
    }
};


//add expense
const addExpense = async (req, res) => {
    const { description, amount, category, paymentMethod } = req.body;
    try {
        const expense = new Expense({
            description,
            amount,
            category,
            paymentMethod
        });
        await expense.save();

        res.status(201).json({ message: 'Expense added', expense });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Error add a Expense' });
    }
}

//get a all expenses
const getExpenses = async (req, res) => {
    try {
        const { category, startDate, endDate, paymentMethod, sortBy } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (startDate && endDate) filter.createAt = { $gte: startDate, $lte: endDate };
        if (paymentMethod) filter.paymentMethod = paymentMethod;

        const expenses = await Expense.find(filter).sort(sortBy).skip(req.skip).limit(req.limit);
        res.json({ expenses });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//update expense
const updateExpense = async (req, res) => {
    try {
        const id = req.params.id;

        const expense = await Expense.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ expense });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//delete expense
const deleteExpense = async (req,res)=>{
    try {
        const id = req.params.id;

        const expense = await Expense.findByIdAndDelete(id);
        res.status(200).json({message:'Expense Deleted'});

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    uploadCSV
}