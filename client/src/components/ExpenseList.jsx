// client/src/components/ExpenseList.jsx
import React from 'react';
import axios from 'axios';
import './ExpenseList.css';

const ExpenseList = ({ expenses, refreshExpenses }) => {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      refreshExpenses();
    } catch (error) {
      alert('Error deleting expense');
    }
  };

  return (
    <div className="expense-list">
      <h3>History</h3>
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <ul>
          {expenses.map(exp => (
            <li key={exp._id} className="expense-item">
              <div className="expense-left">
                <span className="expense-title">{exp.title}</span>
                <span className="expense-category">{exp.category}</span>
              </div>
              <div className="expense-center">
                <span className="expense-date">{new Date(exp.date).toLocaleDateString()}</span>
              </div>
              <div className="expense-right">
                <span className="expense-amount">${exp.amount}</span>
                <button 
                  onClick={() => handleDelete(exp._id)} 
                  className="delete-btn"
                  style={{ backgroundColor: exp.type === 'income' ? 'blue' : '#dc3545' }}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;
