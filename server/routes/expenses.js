// server/routes/expenses.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key';

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if(!token) return res.status(401).json({ message: 'Access denied, token missing' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch(err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Get all expenses for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId });
    res.json(expenses);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new expense
// server/routes/expenses.js
router.post('/', authMiddleware, async (req, res) => {
  const { title, amount, category, type, date } = req.body;  // Ensure 'type' is included
  console.log("New transaction data:", req.body); // Debug log
  try {
    const expense = new Expense({
      user: req.userId,
      title,
      amount,
      category: category || 'General',
      type: type || 'expense',  // Agar type na mile, default 'expense' hoga
      date: date || Date.now()
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Update expense
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if(!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch(err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete expense
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if(!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted successfully' });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
