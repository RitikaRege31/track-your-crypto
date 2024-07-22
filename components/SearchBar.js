import React, { useState, useEffect } from 'react';
import styles from '../styles/SearchBar.module.css';

const SearchBar = ({ addToWatchlist }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allCoins, setAllCoins] = useState([]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd', {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'x-cg-demo-api-key': 'CG-iy1aPFiBFuLAGo2e4CC2BJ2f'
          }
        });
        const data = await response.json();
        setAllCoins(data);
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };

    fetchCoins();
  }, []);

  const handleChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (newQuery.length > 2) {
      const filteredCoins = allCoins.filter(coin =>
        coin.name.toLowerCase().includes(newQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(newQuery.toLowerCase())
      );
      setResults(filteredCoins);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (coin) => {
    addToWatchlist(coin);
    setQuery('');
    setResults([]);
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for coins..."
        className={styles.input}
      />
      {results.length > 0 && (
        <ul className={styles.suggestions}>
          {results.map((coin) => (
            <li key={coin.id} onClick={() => handleSelect(coin)} className={styles.suggestionItem}>
              <img src={coin.image} alt={coin.name} className={styles.icon} style={{ width: '20px', height: '16px', objectFit: 'cover' }} />
              <span className={styles.name}>{coin.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
