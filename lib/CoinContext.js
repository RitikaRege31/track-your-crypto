// context/CoinContext.js
import React, { createContext, useContext, useState } from 'react';

const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
  const [selectedCoin, setSelectedCoin] = useState(null);

  const handleCoinClick = (coin) => {
    setSelectedCoin(coin);
  };

  return (
    <CoinContext.Provider value={{ selectedCoin, handleCoinClick }}>
      {children}
    </CoinContext.Provider>
  );
};

export const useCoinContext = () => useContext(CoinContext);
