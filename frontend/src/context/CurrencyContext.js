import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const CurrencyContext = createContext();

// Custom hook to use the currency context
export const useCurrency = () => {
  return useContext(CurrencyContext);
};

// Supported currencies we care about
const supportedCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

export const CurrencyProvider = ({ children }) => {
  // Default base currency is INR (Indian Rupee) as per current app logic
  const [currency, setCurrency] = useState('INR');
  const [rates, setRates] = useState({ INR: 1 });
  const [loadingRates, setLoadingRates] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoadingRates(true);
        // Using a free, public API that returns rates base on INR
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates');
        }
        const data = await response.json();
        
        // Filter down to only the currencies we support to save memory
        const filteredRates = {};
        supportedCurrencies.forEach(code => {
          if (data.rates[code]) {
            filteredRates[code] = data.rates[code];
          }
        });
        
        setRates(filteredRates);
      } catch (error) {
        console.error("Currency fetch error:", error);
        // Fallback to static approximate rates if API fails
        setRates({
          INR: 1,
          USD: 0.012,
          EUR: 0.011,
          GBP: 0.009,
          JPY: 1.83,
          AUD: 0.018,
          CAD: 0.016
        });
      } finally {
        setLoadingRates(false);
      }
    };

    fetchRates();
  }, []);

  const formatAmount = (amount) => {
    if (!amount) return '0';
    
    // Convert the base INR amount using the current rate
    const convertedAmount = parseFloat(amount) * (rates[currency] || 1);
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: currency === 'JPY' ? 0 : 2
    }).format(convertedAmount);
  };

  // Helper function to convert a foreign input block back to the base INR
  const convertToBase = (inputAmount) => {
    if (!inputAmount) return 0;
    const rate = rates[currency] || 1;
    // Divide user's input by the current rate to find the absolute base value
    const baseValue = parseFloat(inputAmount) / rate;
    return parseFloat(baseValue.toFixed(2));
  };

  const value = {
    currency,
    setCurrency,
    rates,
    loadingRates,
    formatAmount,
    convertToBase,
    supportedCurrencies
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
