// hooks/useSelectedCoin.js
import { useState } from 'react';

export const useSelectedCoin = () => {
  const [selectedCoin, setSelectedCoin] = useState(null);

  const handleCoinClick = (coin) => {
    setSelectedCoin(coin);
  };

  return { selectedCoin, handleCoinClick };
};
