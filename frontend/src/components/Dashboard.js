import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [view, setView] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [showProfile, setShowProfile] = useState(false);

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

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/transactions/user', {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
          }
        });
        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

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

  return (
    <div className="dashboard-layout">
      <Sidebar setView={setView} setSelectedDate={setSelectedDate} />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Financial Dashboard</h2>
          <div className="profile-section">
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
              <p className="card-amount">₹{income.toLocaleString()}</p>
            </div>
            <div className="card-icon">
              {/* <span className="material-icons">trending_up</span> */}
            </div>
          </div>
          
          <div className="summary-card expense-card">
            <div className="card-content">
              <h3 className="card-title">Expenses</h3>
              <p className="card-amount">₹{expenses.toLocaleString()}</p>
            </div>
            <div className="card-icon">
              {/* <span className="material-icons">trending_down</span> */}
            </div>
          </div>
          
          <div className="summary-card balance-card">
            <div className="card-content">
              <h3 className="card-title">Balance</h3>
              <p className="card-amount">₹{totalBalance.toLocaleString()}</p>
            </div>
            <div className="card-icon">
              {/* <span className="material-icons">account_balance_wallet</span> */}
            </div>
          </div>
        </div>

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
