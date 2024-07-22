// lib/api.js
import axios from 'axios';

const API_KEY = 'CG-iy1aPFiBFuLAGo2e4CC2BJ2f';
const BASE_URL = 'https://api.coingecko.com/api/v3';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'x-cg-demo-api-key': API_KEY,
  },
};

// export const fetchCoins = async (page = 1) => {
//   const response = await axios.get(`${BASE_URL}/coins/markets`, {
//     ...options,
//     params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: 20, page },
//   });
//   return response.data;
// };
export const fetchCoins = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/list', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-cg-demo-api-key': 'CG-iy1aPFiBFuLAGo2e4CC2BJ2f'
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching coins:', error);
      return [];
    }
  };

export const fetchCoinDetail = async (id) => {
  const response = await axios.get(`${BASE_URL}/coins/${id}`, options);
  return response.data;
};

export const searchCoins = async (query) => {
  const response = await axios.get(`${BASE_URL}/search?query=${query}`, options);
  return response.data.coins;
};
