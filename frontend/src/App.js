import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import TransactionTypeSelector from './components/TransactionTypeSelector';
import IncomeForm from './components/IncomeForm';
import ExpenseForm from './components/ExpenseForm';
import TransactionHistory from './components/TransactionHistory';
import GraphsPage from './components/GraphsPage';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  return (
    <div className="App">
      <Login onLogin={onLogin} />
      <p style={{ textAlign: 'center' }}>
        Don't have an account?{' '}
        <button onClick={() => navigate('/signup')}>Signup</button>
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
      <p style={{ textAlign: 'center' }}>
        Already have an account?{' '}
        <button onClick={() => navigate('/')}>Login</button>
      </p>
    </div>
  );
}

function AppContent() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  const addTransaction = (transaction) => {
    setTransactions(prev => [...prev, transaction]);
    navigate('/dashboard'); // Return to dashboard after adding
  };

  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<Dashboard transactions={transactions} />} />
      <Route path="/add" element={<TransactionTypeSelector />} />
      <Route path="/add/income" element={<IncomeForm onAdd={addTransaction} />} />
      <Route path="/add/expense" element={<ExpenseForm onAdd={addTransaction} />} />
      <Route path="/history" element={<TransactionHistory transactions={transactions} />} />
      <Route path="/graphs" element={<GraphsPage />} /> {/* ✅ New Route */}
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
