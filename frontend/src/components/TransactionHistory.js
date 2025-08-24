import React, { useEffect, useState } from 'react';
import './TransactionHistory.css';
import { useNavigate } from 'react-router-dom';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [dateFilterType, setDateFilterType] = useState('none');
  const [dateFilterValue, setDateFilterValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ✅ Secure fetch with token
  const fetchTransactions = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/transactions/user', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        }
      });

      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      } else {
        alert("Failed to fetch transactions.");
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // ✅ Secure DELETE with token
  const handleDelete = async (index) => {
    const tx = transactions[index];
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/transactions/${tx.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (res.ok) {
        alert("Transaction deleted.");
        fetchTransactions();
      } else {
        alert("Failed to delete transaction.");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData({ ...transactions[index] });
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Secure PUT with token
  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/transactions/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        alert("Transaction updated.");
        setEditIndex(null);
        fetchTransactions();
      } else {
        alert("Failed to update transaction.");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditData({});
  };

  // 🔍 Filtering
  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filter === 'all' || tx.type === filter;
    const matchesDate = () => {
      if (!dateFilterType || !dateFilterValue) return true;
      const [dd, mm, yyyy] = tx.date.split('-');
      if (dateFilterType === 'date') return tx.date === dateFilterValue;
      if (dateFilterType === 'month') return `${yyyy}-${mm}` === dateFilterValue;
      if (dateFilterType === 'year') return yyyy === dateFilterValue;
      return true;
    };
    return matchesType && matchesDate();
  });

  return (
    <div className="history-container">
      <h2>Transaction History</h2>

      {/* Filter by type */}
      <div className="filter-section">
        <label>Filter by Type:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Filter by date/month/year */}
      <div className="filter-section">
        <label>Filter by Date:</label>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
          {['none', 'date', 'month', 'year'].map(type => (
            <label key={type}>
              <input
                type="radio"
                name="dateFilter"
                value={type}
                checked={dateFilterType === type}
                onChange={() => {
                  setDateFilterType(type);
                  setDateFilterValue('');
                }}
              />
              {type === 'none' ? 'None' : type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>

        {dateFilterType === 'date' && (
          <input
            type="date"
            onChange={(e) => {
              const [yyyy, mm, dd] = e.target.value.split('-');
              setDateFilterValue(`${dd}-${mm}-${yyyy}`);
            }}
          />
        )}
        {dateFilterType === 'month' && (
          <input
            type="month"
            onChange={(e) => setDateFilterValue(e.target.value)} // yyyy-mm
          />
        )}
        {dateFilterType === 'year' && (
          <input
            type="number"
            placeholder="Enter year (e.g., 2025)"
            onChange={(e) => setDateFilterValue(e.target.value)}
          />
        )}
      </div>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <p>No transactions to show.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx, index) => {
              const actualIndex = transactions.findIndex(t => t.id === tx.id);
              if (actualIndex === editIndex) {
                return (
                  <tr key={tx.id}>
                    <td>{editData.date}</td>
                    <td>{editData.type}</td>
                    <td>
                      <input type="number" value={editData.amount} onChange={(e) => handleEditChange('amount', e.target.value)} />
                    </td>
                    <td>
                      <input type="text" value={editData.category} onChange={(e) => handleEditChange('category', e.target.value)} />
                    </td>
                    <td>
                      <input type="text" value={editData.note} onChange={(e) => handleEditChange('note', e.target.value)} />
                    </td>
                    <td>
                      <button onClick={handleSave}>Save</button>{' '}
                      <button onClick={handleCancel}>Cancel</button>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td>{tx.type}</td>
                  <td>₹{tx.amount}</td>
                  <td>{tx.category}</td>
                  <td>{tx.note || '—'}</td>
                  <td>
                    <button onClick={() => handleEdit(actualIndex)}>Edit</button>{' '}
                    <button onClick={() => handleDelete(actualIndex)} style={{ color: 'red' }}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <button className="back-btn" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default TransactionHistory;
