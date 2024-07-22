// pages/explore.js
import React, { useState, useEffect } from 'react';
import { fetchCoins } from '../lib/api';
import CoinCard from '../components/CoinCard';
import styles from '../styles/Explore.module.css';

export default function Explore() {
  const [coins, setCoins] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadCoins = async () => {
      const newCoins = await fetchCoins(page);
      setCoins((prevCoins) => [...prevCoins, ...newCoins]);
    };

    loadCoins();
  }, [page]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Explore Cryptocurrencies</h1>
        <div className={styles.grid}>
          {coins.map((coin) => (
            <CoinCard key={coin.id} coin={coin} />
          ))}
        </div>
        <button onClick={() => setPage((prevPage) => prevPage + 1)}>Load More</button>
      </main>
    </div>
  );
}
