// pages/[id].js
import React from 'react';
import { fetchCoinDetail } from '../lib/api';
import CoinDetail from '../components/CoinDetails';
import styles from '../styles/CoinDetail.module.css';

const CoinPage = ({ coin }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <CoinDetail coin={coin} />
      </main>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const coin = await fetchCoinDetail(params.id);
  return {
    props: { coin },
  };
}

export default CoinPage;
