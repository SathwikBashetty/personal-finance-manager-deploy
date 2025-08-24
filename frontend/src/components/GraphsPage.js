import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { parse, isSameMonth, isSameYear, subMonths, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import './GraphsPage.css';

const COLORS = ['#4caf50', '#f44336', '#2196f3', '#ff9800', '#9c27b0', '#3f51b5', '#00bcd4', '#e91e63'];

function GraphsPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('expense');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/transactions/user', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };

    fetchTransactions();
  }, []);

  const getFilteredTransactions = () => {
    const now = new Date();
    return transactions.filter(tx => {
      if (tx.type !== type || !tx.date) return false;
      const [dd, mm, yyyy] = tx.date.split('-');
      const dateObj = parse(`${yyyy}-${mm}-${dd}`, 'yyyy-MM-dd', new Date());

      if (filter === 'monthly') return isSameMonth(dateObj, now);
      if (filter === 'yearly') return isSameYear(dateObj, now);
      return true;
    });
  };

  const getPieData = () => {
    const filtered = getFilteredTransactions();
    const categoryTotals = {};

    filtered.forEach(tx => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + parseFloat(tx.amount);
    });

    return Object.entries(categoryTotals).map(([category, value]) => ({
      name: category,
      value
    }));
  };

  const getBarChartData = () => {
    const now = new Date();
    const monthMap = {};

    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const key = format(monthDate, 'MMM yyyy');
      monthMap[key] = 0;
    }

    transactions.forEach(tx => {
      if (tx.type !== type || !tx.date) return;
      const [dd, mm, yyyy] = tx.date.split('-');
      const txDate = parse(`${yyyy}-${mm}-${dd}`, 'yyyy-MM-dd', new Date());
      const key = format(txDate, 'MMM yyyy');

      if (key in monthMap) {
        monthMap[key] += parseFloat(tx.amount);
      }
    });

    return Object.entries(monthMap).map(([month, value]) => ({ month, value }));
  };

  const pieData = getPieData();
  const barData = getBarChartData();

  return (
    <div className="graphs-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="graphs-title">Financial Overview - {type.charAt(0).toUpperCase() + type.slice(1)}s</h2>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '10px 18px',
            backgroundColor: '#4361ee',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: '0.3s'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="graph-controls">
        <label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Time</option>
            <option value="monthly">This Month</option>
            <option value="yearly">This Year</option>
          </select>
        </label>
      </div>

      <h3 className="chart-title">Category-wise Distribution</h3>
      {pieData.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>No data available for this selection.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}

      <h3 className="chart-title">Monthly Summary (Last 12 Months)</h3>
      {barData.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>No data for the last 12 months.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={type === 'income' ? '#4caf50' : '#f44336'} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default GraphsPage;
