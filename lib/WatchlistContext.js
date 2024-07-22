// context/WatchlistContext.js

import React, { createContext, useState, useContext } from 'react';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);

  const addToWatchlist = (coin) => {
    setWatchlist((prevWatchlist) => [...prevWatchlist, coin]);
  };

  const removeFromWatchlist = (coinId) => {
    setWatchlist((prevWatchlist) => prevWatchlist.filter((coin) => coin.id !== coinId));
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
