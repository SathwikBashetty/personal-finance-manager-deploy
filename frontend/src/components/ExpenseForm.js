import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './IncomeForm.css'; // Using the same CSS file

function ExpenseForm() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [note, setNote] = useState('');
  const navigate = useNavigate();

  const getFormattedDate = () => {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    const newExpense = {
      amount,
      category,
      note,
      type: 'expense',
      date: getFormattedDate(),
    };

    try {
      const res = await fetch("http://localhost:8080/api/transactions/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(newExpense),
      });

      if (res.ok) {
        alert("Expense added successfully!");
        navigate('/dashboard');
      } else {
        alert("Failed to add expense.");
      }
    } catch (error) {
      alert("Error adding expense.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">Add Expense</h2>
        <p className="form-subtitle">Record your new expense</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="food">Food</option>
              <option value="social life">Social Life</option>
              <option value="household">Household</option>
              <option value="transport">Transport</option>
              <option value="beauty">Beauty</option>
              <option value="health">Health</option>
              <option value="gift">Gift</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="note">Note (Optional)</label>
            <input
              type="text"
              id="note"
              placeholder="Add a note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          
          <button type="submit" className="submit-btn expense-btn">
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}

export default ExpenseForm;