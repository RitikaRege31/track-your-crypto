// pages/_app.js

import '../styles/globals.css';
import { WatchlistProvider } from '../lib/WatchlistContext'; // Adjust the path if needed
import { CoinProvider } from '../lib/CoinContext'; // Adjust the path if needed

function MyApp({ Component, pageProps }) {
  return (
    <WatchlistProvider>
      <CoinProvider>
        <Component {...pageProps} />
      </CoinProvider>
    </WatchlistProvider>
  );
}

export default MyApp;
