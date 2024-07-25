// components/TopCoinsTable.js
import React, { useState, useEffect, useCallback } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styles from '../styles/TopCoinsTable.module.css';
import { useCoinContext } from '../lib/CoinContext';

const TOP_COINS_API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=';

// Fetch and cache top coins data
const fetchTopCoins = async (page) => {
  try {
    const response = await fetch(`${TOP_COINS_API_URL}${page}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': 'CG-iy1aPFiBFuLAGo2e4CC2BJ2f',
      },
    });
    return response.json();
  } catch (error) {
    console.error('Error fetching top coins data:', error);
    return [];
  }
};

const TopCoinsTable = () => {
  const [topCoins, setTopCoins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { handleCoinClick } = useCoinContext();

  // Fetch top coins data and update state
  const updateTopCoins = useCallback(async (page) => {
    const data = await fetchTopCoins(page);
    setTopCoins(data);

    // Calculate the total number of pages (replace with actual API response if available)
    setTotalPages(Math.ceil(10000 / 20)); // Assumed total items
  }, []);

  useEffect(() => {
    updateTopCoins(currentPage);
  }, [currentPage, updateTopCoins]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className={styles.topCoinsTable}>
      <h2>Top 20 Coins</h2>
      <table>
        <thead>
          <tr>
            <th>Icon</th>
            <th>Name</th>
            <th>Price</th>
            <th>High 24H</th>
            <th>Low 24H</th>
            <th>Price Change 24H</th>
            <th>Total Volume</th>
          </tr>
        </thead>
        <tbody>
          {topCoins.map((coin, index) => (
            <Draggable key={coin.id} draggableId={coin.id} index={index}>
              {(provided) => (
                <tr
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  onClick={() => handleCoinClick(coin)}
                >
                  <td>
                    <img src={coin.image} alt={coin.name} style={{ width: '20px', height: '16px', objectFit: 'cover' }} />
                  </td>
                  <td>{coin.name}</td>
                  <td>${coin.current_price.toLocaleString()}</td>
                  <td>${coin.high_24h.toFixed(2)}</td>
                  <td>${coin.low_24h.toFixed(2)}</td>
                  <td>{coin.price_change_percentage_24h.toFixed(2)}%</td>
                  <td>${coin.total_volume.toLocaleString()}</td>
                </tr>
              )}
            </Draggable>
          ))}
        </tbody>
      </table>
      <div className={styles.paginationControls}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1} className={styles.paginationButton}><b>Previous</b></button>
        <span className={styles.pageIndicator}>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className={styles.paginationButton}><b>Next</b></button>
      </div>
    </div>
  );
};

export default TopCoinsTable;
