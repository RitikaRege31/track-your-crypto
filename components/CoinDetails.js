import React, { useEffect, useState, useCallback } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import simulateLivePriceUpdates from '../utils/mockLivePrices';
import PubSub from '../utils/pubsub';

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement);

const CoinDetails = ({ coin }) => {
  const [coinDetails, setCoinDetails] = useState(null);
  const [chartData, setChartData] = useState({});
  const [priceHistoryData, setPriceHistoryData] = useState({});
  const [sevenDayData, setSevenDayData] = useState([]);
  const [livePrice, setLivePrice] = useState(null);

  const fetchData = useCallback(async () => {
    if (!coin) return;
    
    try {
      const responses = await Promise.all([
        fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-iy1aPFiBFuLAGo2e4CC2BJ2f'
          }
        }),
        fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=1&interval=hourly`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-iy1aPFiBFuLAGo2e4CC2BJ2f'
          }
        }),
        fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=30&interval=daily`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-iy1aPFiBFuLAGo2e4CC2BJ2f'
          }
        }),
        fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=7&interval=daily`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-iy1aPFiBFuLAGo2e4CC2BJ2f'
          }
        })
      ]);

      const [details, chart, history, sevenDay] = await Promise.all(responses.map(res => res.json()));

      setCoinDetails(details);
      setChartData(chart);
      setPriceHistoryData(history);
      setSevenDayData(sevenDay.prices);

      simulateLivePriceUpdates(coin.id); // Start simulating live price updates
    } catch (error) {
      console.error('Error fetching coin details or chart data:', error);
    }
  }, [coin]);

  useEffect(() => {
    fetchData();
    
    const handlePriceUpdate = (newPrice) => {
      setLivePrice(newPrice);
    };

    PubSub.subscribe('priceUpdate', handlePriceUpdate);

    // Remove unsubscription logic if not supported
    // return () => {
    //   PubSub.unsubscribe('priceUpdate', handlePriceUpdate);
    // };
  }, [fetchData]);

  const formatPriceHistoryData = () => {
    if (!priceHistoryData.prices) return { labels: [], datasets: [] };

    const labels = priceHistoryData.prices.map(([timestamp]) => new Date(timestamp).toLocaleDateString());
    const data = priceHistoryData.prices.map(([, price]) => price);

    return {
      labels,
      datasets: [
        {
          label: 'Price (Last 30 Days)',
          data,
          borderColor: '#DE3163',
          backgroundColor: '#DE3163',
          fill: true,
        }
      ]
    };
  };

  const formatSevenDayData = () => {
    if (!sevenDayData.length) return { labels: [], datasets: [] };

    const labels = sevenDayData.map(([timestamp]) => new Date(timestamp).toLocaleDateString());
    const data = sevenDayData.map(([, price]) => price);
    const currentPrice = coinDetails?.market_data?.current_price?.usd || 0;

    return {
      labels,
      datasets: [
        {
          label: 'Price (Last 7 Days)',
          data,
          backgroundColor: '#D8BFD8',
          borderColor: '#76b900',
        },
        {
          label: 'Current Price',
          data: Array(data.length).fill(livePrice || currentPrice),
          backgroundColor: '#E0115F',
          borderColor: '#E0115F',
          type: 'line',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        },
      ]
    };
  };

  return (
    <div>
      {coinDetails && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'left',
          margin: '20px auto',
          maxWidth: '600px'
        }}>
          <h2 style={{ fontSize: '36px' }}><b>{coinDetails.name}</b></h2><br/>
          <img src={coinDetails.image.large} alt={coinDetails.name} style={{ width: '100px', height: '100px' }} /><br/>
          <p>Current Price: ${livePrice || coinDetails.market_data.current_price.usd}</p>
          <p>Market Cap: ${coinDetails.market_data.market_cap.usd}</p>
          <p>Market Cap Rank: {coinDetails.market_cap_rank}</p>
          <p>Total Volume: ${coinDetails.market_data.total_volume.usd}</p>
          <p>High 24H: ${coinDetails.market_data.high_24h.usd}</p>
          <p>Low 24H: ${coinDetails.market_data.low_24h.usd}</p>
          <p>Price Change 24H: ${coinDetails.market_data.price_change_24h.usd}</p>
          <p>Price Change % 24H: {coinDetails.market_data.price_change_percentage_24h}%</p>
          <p>All-Time High: ${coinDetails.market_data.ath.usd}</p>
          <p>Price Change % 1H: {coinDetails.market_data.price_change_percentage_1h_in_currency.usd}%</p><br/>

          {priceHistoryData.prices && (
            <div style={{ width: '100%', height: '400px', margin: '20px 0', textAlign: 'center' }}>
              <h3 style={{ fontSize: '24px' }}><b>Price vs. Date (Last 30 Days)</b></h3><br/>
              <Line
                data={formatPriceHistoryData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: '#333',
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `${context.dataset.label}: $${context.raw}`;
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        color: '#ddd',
                        borderColor: '#ddd',
                      },
                      ticks: {
                        color: '#555',
                        autoSkip: true,
                        maxTicksLimit: 10,
                      },
                      title: {
                        display: true,
                        text: 'Date',
                        color: '#666',
                      },
                    },
                    y: {
                      grid: {
                        color: '#ddd',
                        borderColor: '#ddd',
                      },
                      ticks: {
                        color: '#555',
                        autoSkip: true,
                        maxTicksLimit: 10,
                      },
                      title: {
                        display: true,
                        text: 'Price',
                        color: '#666',
                      },
                    },
                  },
                }}
              />
            </div>
          )}

          {sevenDayData.length > 0 && (
            <div style={{ width: '100%', height: '400px', margin: '20px 0', textAlign: 'center' }}>
              <br/><br/>
              <h3 style={{ fontSize: '24px' }}><b>Price vs. Date (Last 7 Days)</b></h3><br/>
              <Bar
                data={formatSevenDayData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: '#333',
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `${context.dataset.label}: $${context.raw}`;
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        color: '#ddd',
                        borderColor: '#ddd',
                      },
                      ticks: {
                        color: '#555',
                        autoSkip: true,
                        maxTicksLimit: 7,
                      },
                      title: {
                        display: true,
                        text: 'Date',
                        color: '#666',
                      },
                    },
                    y: {
                      grid: {
                        color: '#ddd',
                        borderColor: '#ddd',
                      },
                      ticks: {
                        color: '#555',
                        autoSkip: true,
                        maxTicksLimit: 10,
                      },
                      title: {
                        display: true,
                        text: 'Price',
                        color: '#666',
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoinDetails;
