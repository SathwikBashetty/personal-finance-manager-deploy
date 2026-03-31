import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import TransactionTypeSelector from './components/TransactionTypeSelector';
import IncomeForm from './components/IncomeForm';
import ExpenseForm from './components/ExpenseForm';
import TransactionHistory from './components/TransactionHistory';
import GraphsPage from './components/GraphsPage';
import GoalsPage from './components/GoalsPage';
import { CurrencyProvider } from './context/CurrencyContext';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  return (
    <div className="App">
      <Login onLogin={onLogin} />
      <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
        <button onClick={() => navigate('/signup')} style={{ background: 'transparent', color: 'var(--primary-color)', boxShadow: 'none', padding: 0 }}>Create one</button>
      </p>
    </div>
  );
}

function SignupPage() {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/'); // Go to login page
  };

  return (
    <div className="App">
      <Signup onSignup={handleSignup} />
      <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', color: 'var(--primary-color)', boxShadow: 'none', padding: 0 }}>Log in</button>
      </p>
    </div>
  );
}

function AppContent() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8080/api/transactions/user', {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleLogin = () => {
    fetchTransactions();
    navigate('/dashboard');
  };

  // Called after adding income/expense to refresh data
  const refreshTransactions = () => {
    fetchTransactions();
  };

  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <Dashboard
            transactions={transactions}
            loading={loading}
            error={error}
            refreshTransactions={refreshTransactions}
            toggleTheme={toggleTheme}
            isDarkMode={darkMode}
          />
        }
      />
      <Route path="/add" element={<TransactionTypeSelector />} />
      <Route path="/add/income" element={<IncomeForm onAdd={refreshTransactions} />} />
      <Route path="/add/expense" element={<ExpenseForm onAdd={refreshTransactions} />} />
      <Route
        path="/history"
        element={
          <TransactionHistory
            transactions={transactions}
            loading={loading}
            error={error}
            refreshTransactions={refreshTransactions}
          />
        }
      />
      <Route path="/graphs" element={<GraphsPage />} />
      <Route path="/goals" element={<GoalsPage />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
