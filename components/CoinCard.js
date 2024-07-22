// components/CoinCard.js

import Link from 'next/link';
import styles from '../styles/CoinCard.module.css'; // Adjust the path if needed
import { useWatchlist } from '../lib/WatchlistContext';

const CoinCard = ({ coin }) => {
  const { addToWatchlist } = useWatchlist();

  return (
    <Link href={`/coin/${coin.id}`} className={styles.card}>
      <div>
        <h3>{coin.name}</h3>
        <p>{coin.current_price} USD</p>
        <button onClick={() => addToWatchlist(coin)}>Add to Watchlist</button>
      </div>
    </Link>
  );
};

export default CoinCard;
