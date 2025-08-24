import React from 'react';
import './TransactionTypeSelector.css';
import { useNavigate } from 'react-router-dom';

function TransactionTypeSelector() {
  const navigate = useNavigate();

  const handleSelect = (type) => {
    navigate(`/add/${type.toLowerCase()}`);
  };

  return (
    <div className="selector-container">
      <div className="selector-card">
        <h2 className="selector-title">Select Transaction Type</h2>
        <p className="selector-subtitle">Choose whether you want to record income or an expense</p>
        <div className="button-group">
          <button 
            className="income-btn"
            onClick={() => handleSelect('Income')}
          >
            Income
          </button>
          <button 
            className="expense-btn"
            onClick={() => handleSelect('Expense')}
          >
            Expense
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionTypeSelector;