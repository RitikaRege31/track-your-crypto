// pages/index.js

import React, { useState, useEffect } from 'react';
import { fetchCoins } from '../lib/api';
import TopCoinsTable from '../components/TopCoinsTable';
import Header from '../components/Header';
import Watchlist from '../components/Watchlist';
import CoinDetails from '../components/CoinDetails';
import { useWatchlist } from '../lib/WatchlistContext';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styles from '../styles/Home.module.css';
import { useCoinContext } from '../lib/CoinContext';
import { useSelectedCoin } from '../hooks/useSelectedCoin';


export default function Home() {
  const [coins, setCoins] = useState([]);
  const [page, setPage] = useState(1);
  const { watchlist, addToWatchlist, setWatchlist } = useWatchlist();
  const { selectedCoin, handleCoinClick } = useCoinContext();

  useEffect(() => {
    const loadCoins = async () => {
      const newCoins = await fetchCoins(page);
      setCoins((prevCoins) => [...prevCoins, ...newCoins]);
    };

    loadCoins();
  }, [page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Handle dragging within the watchlist
    if (source.droppableId === 'watchlist' && destination.droppableId === 'watchlist') {
      const updatedWatchlist = Array.from(watchlist);
      const [movedCoin] = updatedWatchlist.splice(source.index, 1);
      updatedWatchlist.splice(destination.index, 0, movedCoin);
      setWatchlist(updatedWatchlist);
      return;
    }

    // Handle dragging from top coins to the watchlist
    if (source.droppableId === 'topCoins' && destination.droppableId === 'watchlist') {
      const selectedCoin = coins.find((coin) => coin.id === draggableId);
      addToWatchlist(selectedCoin);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <main className={styles.main}>
            <Droppable droppableId="topCoins" type="COINS">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <TopCoinsTable coins={coins} />
                  {provided.placeholder}
                  <button onClick={handleLoadMore}>Load More</button>
                </div>
              )}
            </Droppable>
            {/* {selectedCoin && <CoinDetails coin={selectedCoin} />} */}
            
          </main>
          <aside className={styles.watchlist}>
            <Droppable droppableId="watchlist" type="COINS">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <Watchlist watchlist={watchlist} />
                  {provided.placeholder}
                  <br/><br/><br/><br/>
                </div>
              )}
            </Droppable>
            {selectedCoin && <CoinDetails coin={selectedCoin} />}
          </aside>
        </DragDropContext>
      </div>
    </div>
  );
}