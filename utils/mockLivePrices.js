import PubSub from './pubsub';

const simulateLivePriceUpdates = (coinId) => {
  setInterval(async () => {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
      const data = await response.json();
      const newPrice = data[coinId].usd;
      PubSub.publish('priceUpdate', newPrice);
    } catch (error) {
      console.error('Error fetching live price:', error);
    }
  }, 60000); // Update every 60 seconds
};

export default simulateLivePriceUpdates;
