import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import './CurrencySelector.css';

const CurrencySelector = () => {
  const { currency, setCurrency, supportedCurrencies, loadingRates } = useCurrency();

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  return (
    <div className="currency-selector-container">
      <select 
        value={currency} 
        onChange={handleCurrencyChange}
        className="currency-dropdown"
        title="Select Currency"
        disabled={loadingRates}
      >
        {loadingRates ? (
          <option value={currency}>Loading...</option>
        ) : (
          supportedCurrencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default CurrencySelector;
