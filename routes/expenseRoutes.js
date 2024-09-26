const express = require('express');
const { addExpense, getExpenses, updateExpense, deleteExpense, uploadCSV } = require('../controllers/expenseController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const routes = express.Router();

routes.post('/add', protect, addExpense);
routes.get('/', protect, getExpenses);
routes.put('/:id', protect, updateExpense);
routes.delete('/:id', protect, deleteExpense);
routes.post('/upload',upload.single('file'), uploadCSV);

module.exports = routes;