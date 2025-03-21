// client/src/components/ExpenseForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './ExpenseForm.css';

const ExpenseForm = ({ onExpenseAdded }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense'); // Default type

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create payload with proper type conversion for amount
    const payload = {
      title,
      amount: Number(amount), // Convert amount to number
      category,
      type
    };
    console.log('Payload:', payload); // Debug log
    try {
      await axios.post('/api/expenses', payload, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      setTitle('');
      setAmount('');
      setCategory('');
      setType('expense');
      onExpenseAdded();
    } catch (error) {
      alert('Error adding transaction');
    }
  };

  return (
    <div className="expense-form-card">
      <h3>Add New Transaction</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input 
            type="text" 
            placeholder="Enter title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input 
            type="number" 
            placeholder="Enter amount" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input 
            type="text" 
            placeholder="e.g. Food, Transport" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Add Transaction</button>
      </form>
    </div>
  );
};

export default ExpenseForm;
