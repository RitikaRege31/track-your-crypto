import React from 'react';
import { useWatchlist } from '../lib/WatchlistContext';
import SearchBar from './SearchBar'; // Import the SearchBar component
import styles from '../styles/Header.module.css'; // Adjust the path if needed

const Header = () => {
  const { watchlist, addToWatchlist } = useWatchlist(); // Access addToWatchlist

  return (
    <header className={styles.header}>
        <br/><br/><br/><br/>
      <h1><b>Crypto Tracker</b></h1>
      <SearchBar addToWatchlist={addToWatchlist} /> {/* Integrate SearchBar */}
      <div className={styles.watchlistSummary}>
        Watchlist: {watchlist.length} items
      </div>
    </header>
  );
};

export default Header;
