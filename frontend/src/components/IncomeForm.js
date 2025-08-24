import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './IncomeForm.css';

function IncomeForm() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('salary');
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

    const newIncome = {
      amount,
      category,
      note,
      type: 'income',
      date: getFormattedDate(),
    };

    try {
      const res = await fetch("http://localhost:8080/api/transactions/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(newIncome),
      });

      if (res.ok) {
        alert("Income added successfully!");
        navigate('/dashboard');
      } else {
        alert("Failed to add income.");
      }
    } catch (error) {
      alert("Error adding income.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">Add Income</h2>
        <p className="form-subtitle">Record your new income source</p>
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
              <option value="salary">Salary</option>
              <option value="allowance">Allowance</option>
              <option value="bonus">Bonus</option>
              <option value="pettycash">Petty Cash</option>
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
          
          <button type="submit" className="submit-btn income-btn">
            Add Income
          </button>
        </form>
      </div>
    </div>
  );
}

export default IncomeForm;