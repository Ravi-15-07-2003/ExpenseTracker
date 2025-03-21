// server/models/Expense.js
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'General' },
  type: { type: String, enum: ['income', 'expense'], default: 'expense' }, // Added type field
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Expense', ExpenseSchema);
