import React, { useState, useEffect } from 'react';
import './GoalsPage.css';
import Sidebar from './Sidebar';
import { useCurrency } from '../context/CurrencyContext';

function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', targetAmount: '', deadline: '' });
  const { formatAmount } = useCurrency();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/goals", {
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
      });
      if (res.ok) {
        const data = await res.json();
        setGoals(data);
      }
    } catch (err) {
      console.error("Error fetching goals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/goals/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
          ...newGoal,
          targetAmount: parseFloat(newGoal.targetAmount),
          currentAmount: 0
        })
      });
      if (res.ok) {
        setShowModal(false);
        setNewGoal({ title: '', targetAmount: '', deadline: '' });
        fetchGoals();
      }
    } catch (err) {
      console.error("Error adding goal:", err);
    }
  };

  const handleAddFunds = async (goalId, amountToAdd) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedGoal = {
      ...goal,
      currentAmount: goal.currentAmount + parseFloat(amountToAdd)
    };

    try {
      const res = await fetch(`http://localhost:8080/api/goals/${goalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(updatedGoal)
      });
      if (res.ok) {
        fetchGoals();
      }
    } catch (err) {
      console.error("Error updating goal:", err);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/goals/${goalId}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
      });
      if (res.ok) {
        fetchGoals();
      }
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="goals-container">
        <div className="goals-header">
          <h2 className="goals-title">Savings Goals</h2>
          <button className="add-goal-btn" onClick={() => setShowModal(true)}>+ New Goal</button>
        </div>

        {loading ? (
          <div className="loading">Loading goals...</div>
        ) : (
          <div className="goals-grid">
            {goals.map(goal => {
              const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100).toFixed(1);
              return (
                <div key={goal.id} className="goal-card">
                  <div className="goal-card-header">
                    <h3 className="goal-name">{goal.title}</h3>
                    <button className="delete-goal-btn" onClick={() => handleDeleteGoal(goal.id)}>×</button>
                  </div>
                  
                  <div className="goal-amounts">
                    <span className="current">{formatAmount(goal.currentAmount)}</span>
                    <span className="separator">of</span>
                    <span className="target">{formatAmount(goal.targetAmount)}</span>
                  </div>

                  <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    <span className="progress-text">{progress}%</span>
                  </div>

                  <div className="goal-footer">
                    <span className="deadline">{goal.deadline ? `Target: ${goal.deadline}` : 'No deadline'}</span>
                    <button 
                      className="add-funds-btn"
                      onClick={() => {
                        const amount = prompt("Enter amount to add:");
                        if (amount && !isNaN(amount)) handleAddFunds(goal.id, amount);
                      }}
                    >
                      Add Funds
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content glass-card">
              <h3>Create New Saving Goal</h3>
              <form onSubmit={handleAddGoal}>
                <div className="form-group">
                  <label>Goal Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. New Laptop" 
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Target Amount (INR)</label>
                  <input 
                    type="number" 
                    placeholder="50000" 
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Deadline (Optional)</label>
                  <input 
                    type="date" 
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="submit-btn highlight-btn">Create Goal</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoalsPage;
