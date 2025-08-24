import React, { useState } from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

function Sidebar({ setView, setSelectedDate }) {
  const navigate = useNavigate();
  const [type, setType] = useState(null);
  const [activeButton, setActiveButton] = useState('dashboard');

  const handleChange = (e) => {
    const val = e.target.value;

    if (type === 'yearly') {
      setSelectedDate(`01-01-${val}`);
    } else if (type === 'monthly') {
      const [year, month] = val.split('-');
      setSelectedDate(`01-${month}-${year}`);
    } else {
      const [year, month, day] = val.split('-');
      setSelectedDate(`${day}-${month}-${year}`);
    }

    setView(type);
  };

  const renderPicker = () => {
    if (type === 'daily') {
      return (
        <div className="picker-container">
          <input 
            type="date" 
            onChange={handleChange} 
            className="date-picker"
          />
        </div>
      );
    } else if (type === 'monthly') {
      return (
        <div className="picker-container">
          <input 
            type="month" 
            onChange={handleChange} 
            className="month-picker"
          />
        </div>
      );
    } else if (type === 'yearly') {
      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
      return (
        <div className="picker-container">
          <select 
            onChange={handleChange}
            className="year-select"
          >
            <option value="">Select Year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      );
    }
    return null;
  };

  const handleNavigation = (path, buttonName) => {
    navigate(path);
    setActiveButton(buttonName);
  };

  const handleFilterClick = (filterType) => {
    setType(filterType);
    if (filterType === 'none') {
      setView('all');
      setSelectedDate('');
    }
    setActiveButton(filterType);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">Menu</h3>
      </div>
      
      <div className="sidebar-menu">
        <button 
          className={`menu-button ${activeButton === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavigation('/dashboard', 'dashboard')}
        >
          <span className="button-icon">📊</span>
          Dashboard
        </button>
        
        <button 
          className={`menu-button ${activeButton === 'history' ? 'active' : ''}`}
          onClick={() => handleNavigation('/history', 'history')}
        >
          <span className="button-icon">📝</span>
          Transaction History
        </button>
      </div>
      
      <div className="divider"></div>
      
      <div className="filter-section">
        <h4 className="filter-title">Filter By:</h4>
        <button 
          className={`filter-button ${activeButton === 'none' ? 'active' : ''}`}
          onClick={() => handleFilterClick('none')}
        >
          <span className="button-icon">❌</span>
          None
        </button>
        <button 
          className={`filter-button ${activeButton === 'daily' ? 'active' : ''}`}
          onClick={() => handleFilterClick('daily')}
        >
          <span className="button-icon">📅</span>
          Daily
        </button>
        <button 
          className={`filter-button ${activeButton === 'monthly' ? 'active' : ''}`}
          onClick={() => handleFilterClick('monthly')}
        >
          <span className="button-icon">🗓️</span>
          Monthly
        </button>
        <button 
          className={`filter-button ${activeButton === 'yearly' ? 'active' : ''}`}
          onClick={() => handleFilterClick('yearly')}
        >
          <span className="button-icon">📆</span>
          Yearly
        </button>
      </div>
      
      {renderPicker()}
    </div>
  );
}

export default Sidebar;