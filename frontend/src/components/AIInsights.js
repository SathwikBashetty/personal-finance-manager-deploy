import React, { useState, useEffect } from 'react';
import './AIInsights.css';

function AIInsights() {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/ai/insights", {
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
      });
      if (res.ok) {
        const data = await res.json();
        setInsight(data.insight);
      } else {
        setInsight("Unable to fetch insights at this moment.");
      }
    } catch (err) {
      console.error("Error fetching AI insights:", err);
      setInsight("Error connecting to AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-insights-card glass-card">
      <div className="ai-header">
        <div className="ai-icon-container">
          <span className="material-icons ai-sparkle">auto_awesome</span>
        </div>
        <div className="ai-title-wrapper">
          <h3 className="ai-title">AI Spending Insights</h3>
          <span className="ai-badge">Personalized Advisor</span>
        </div>
      </div>

      <div className="ai-content">
        {loading ? (
          <div className="ai-loading">
            <div className="ai-loading-spinner"></div>
            <span>Analyzing spending habits...</span>
          </div>
        ) : (
          <div className="ai-text-wrapper fadeIn">
            {insight.split('\n').map((line, index) => (
              <p key={index} className="ai-insight-line">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="ai-footer">
        <button className="ai-refresh-btn" onClick={fetchInsights} disabled={loading}>
          {loading ? 'Consulting...' : 'Get Fresh Advice'}
        </button>
      </div>
    </div>
  );
}

export default AIInsights;
