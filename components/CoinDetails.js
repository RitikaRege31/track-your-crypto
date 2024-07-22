import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const CoinDetails = ({ coin }) => {
  const [coinDetails, setCoinDetails] = useState(null);
  const [chartData, setChartData] = useState({});
  const [priceHistoryData, setPriceHistoryData] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch coin details
        const detailsResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-iy1aPFiBFuLAGo2e4CC2BJ2f'
          }
        });
        const details = await detailsResponse.json();
        setCoinDetails(details);

        // Fetch hourly price data for the past day
        const chartResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=1&interval=hourly`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-iy1aPFiBFuLAGo2e4CC2BJ2f'
          }
        });
        const chart = await chartResponse.json();
        setChartData(chart);

        // Fetch daily price data for the past 30 days
        const historyResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=30&interval=daily`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-iy1aPFiBFuLAGo2e4CC2BJ2f'
          }
        });
        const history = await historyResponse.json();
        setPriceHistoryData(history);

      } catch (error) {
        console.error('Error fetching coin details or chart data:', error);
      }
    };

    if (coin) {
      fetchDetails();
    }
  }, [coin]);

  // Format data for the daily price chart
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
          <p>Current Price: ${coinDetails.market_data.current_price.usd}</p>
          <p>Market Cap: ${coinDetails.market_data.market_cap.usd}</p>
          <p>Market Cap Rank: {coinDetails.market_cap_rank}</p>
          <p>Total Volume: ${coinDetails.market_data.total_volume.usd}</p>
          <p>High 24H: ${coinDetails.market_data.high_24h.usd}</p>
          <p>Low 24H: ${coinDetails.market_data.low_24h.usd}</p>
          <p>Price Change 24H: ${coinDetails.market_data.price_change_24h.usd}</p>
          <p>Price Change % 24H: {coinDetails.market_data.price_change_percentage_24h}%</p>
          <p>All-Time High: ${coinDetails.market_data.ath.usd}</p>
          <p>Price Change % 1H: {coinDetails.market_data.price_change_percentage_1h_in_currency.usd}%</p><br/>

          {/* 7D Sparkline
          {coinDetails.market_data.sparkline_7d && (
            <div style={{ margin: '20px 0' }}>
              <h3>Price Sparkline (7 Days)</h3>
              <Line
                data={{
                  labels: coinDetails.market_data.sparkline_7d.price.map((_, i) => i),
                  datasets: [
                    {
                      label: 'Price',
                      data: coinDetails.market_data.sparkline_7d.price,
                      borderColor: '#ff5733',
                      backgroundColor: 'rgba(255, 87, 51, 0.2)',
                      fill: true,
                    },
                  ],
                }}
                options={{ responsive: true }}
              />
            </div>
          )} */}

          {/* Daily Price History */}
          {priceHistoryData.prices && (
            <div style={{ width: '100%', height: '400px', margin: '20px 0' , alignContent:'center',textAlign: 'center'}}>
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
                      color: '#333',
                      font: {
                        size: 14,
                      },
                    },
                  },
                  y: {
                    grid: {
                      color: '#ddd',
                      borderColor: '#ddd',
                    },
                    ticks: {
                      color: '#555',
                      callback: function (value) {
                        return `$${value}`;
                      },
                    },
                    title: {
                      display: true,
                      text: 'Price (USD)',
                      color: '#333',
                      font: {
                        size: 14,
                      },
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
