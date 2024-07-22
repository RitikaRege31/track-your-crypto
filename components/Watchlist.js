// components/Watchlist.js
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from '../styles/Watchlist.module.css';

const Watchlist = ({ watchlist, setWatchlist }) => {
  const [coinDetails, setCoinDetails] = useState({});

  useEffect(() => {
    const fetchCoinDetails = async () => {
      const details = {};
      for (const coin of watchlist) {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'x-cg-demo-api-key': 'CG-iy1aPFiBFuLAGo2e4CC2BJ2f'
          }
        });
        const data = await response.json();
        details[coin.id] = data;
      }
      setCoinDetails(details);
    };

    fetchCoinDetails();
  }, [watchlist]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    if (result.type === 'WATCHLIST') {
      const updatedWatchlist = Array.from(watchlist);
      const [movedCoin] = updatedWatchlist.splice(result.source.index, 1);
      updatedWatchlist.splice(result.destination.index, 0, movedCoin);
      setWatchlist(updatedWatchlist);
    } else if (result.type === 'TOPCOINS') {
      const { draggableId } = result;
      const selectedCoin = topCoins.find((coin) => coin.id === draggableId);
      setWatchlist((prevWatchlist) => [...prevWatchlist, selectedCoin]);
    }
  };

  return (
    <div className={styles.watchlist}>
      <h2>Watchlist</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="watchlist" type="WATCHLIST">
          {(provided) => (
            <table {...provided.droppableProps} ref={provided.innerRef} className={styles.table}>
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Symbol</th>
                  <th>Last Price</th>
                  <th>24H Change</th>
                  <th>Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map((coin, index) => {
                  const details = coinDetails[coin.id] || {};
                  return (
                    <Draggable key={coin.id} draggableId={coin.id} index={index}>
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <td><img src={details.image?.small} alt={coin.name} className={styles.icon} /></td>
                          <td>{details.name}</td>
                          <td>{details.symbol}</td>
                          <td>{details.market_data?.current_price?.usd}</td>
                          <td>{details.market_data?.price_change_percentage_24h}%</td>
                          <td>{details.market_data?.market_cap?.usd}</td>
                        </tr>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Watchlist;
