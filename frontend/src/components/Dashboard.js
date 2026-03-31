import React, { useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useCurrency } from '../context/CurrencyContext';
import CurrencySelector from './CurrencySelector';
import AIInsights from './AIInsights';

function Dashboard({ transactions, loading, error, refreshTransactions, toggleTheme, isDarkMode }) {
  const navigate = useNavigate();
  const [view, setView] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const { formatAmount } = useCurrency();

  const getUserEmailFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return payload.sub;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  };

  const userEmail = getUserEmailFromToken();

  // Fetching is now handled in App.js

  const filteredTxns = transactions.filter(tx => {
    if (!tx.date) return false;
    const [dd, mm, yyyy] = tx.date.split('-');
    const txDate = new Date(`${yyyy}-${mm}-${dd}`);

    let selected = null;
    if (selectedDate) {
      const [sdd, smm, syyyy] = selectedDate.split('-');
      selected = new Date(`${syyyy}-${smm}-${sdd}`);
    }

    if (view === 'daily') {
      return selected && txDate.toDateString() === selected.toDateString();
    } else if (view === 'monthly') {
      return selected &&
        txDate.getMonth() === selected.getMonth() &&
        txDate.getFullYear() === selected.getFullYear();
    } else if (view === 'yearly') {
      return selected && txDate.getFullYear() === selected.getFullYear();
    }
    return true;
  });

  const income = filteredTxns
    .filter(tx => tx.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const expenses = filteredTxns
    .filter(tx => tx.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalBalance = income - expenses;

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("You will be logged out.");
    navigate('/');
  };

  const handleChangePassword = () => {
    alert("Redirect to Change Password page or modal.");
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar setView={setView} setSelectedDate={setSelectedDate} />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Financial Dashboard</h2>
          <div className="profile-section">
            <CurrencySelector />
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              style={{ marginRight: '1rem', padding: '0.5rem', cursor: 'pointer' }}
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button
              className="profile-icon"
              onClick={() => setShowProfile(!showProfile)}
              aria-label="Profile menu"
            >
              {/* <span className="material-icons">account_circle</span> */}
            </button>
            {showProfile && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <p className="profile-email">{userEmail || "Unknown"}</p>
                </div>
                <button
                  className="dropdown-btn"
                  onClick={handleChangePassword}
                >
                  Change Password
                </button>
                <button
                  className="dropdown-btn logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="summary-cards">
          <div className="summary-card income-card">
            <div className="card-content">
              <h3 className="card-title">Income</h3>
              <p className="card-amount">{formatAmount(income)}</p>
            </div>
            <div className="card-icon">
              {/* <span className="material-icons">trending_up</span> */}
            </div>
          </div>

          <div className="summary-card expense-card">
            <div className="card-content">
              <h3 className="card-title">Expenses</h3>
              <p className="card-amount">{formatAmount(expenses)}</p>
            </div>
            <div className="card-icon">
              {/* <span className="material-icons">trending_down</span> */}
            </div>
          </div>

          <div className="summary-card balance-card">
            <div className="card-content">
              <h3 className="card-title">Balance</h3>
              <p className="card-amount">{formatAmount(totalBalance)}</p>
            </div>
            <div className="card-icon">
              {/* <span className="material-icons">account_balance_wallet</span> */}
            </div>
          </div>
        </div>

        <AIInsights />

        <div className="action-buttons">
          <button
            className="history-button"
            onClick={() => navigate('/history')}
          >
            View Transaction History
          </button>

          <button
            className="graphs-button"
            onClick={() => navigate('/graphs')}
          >
            View Graphs
          </button>

          <button
            className="add-button floating-action-btn"
            onClick={() => navigate('/add')}
            aria-label="Add transaction"
          >
            <span className="material-icons">add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
