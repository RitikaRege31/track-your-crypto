import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend);

const MarketCapChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketCapData = async () => {
      try {
        // Fetch top 5 coins by total volume
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=5&page=1', {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-iy1aPFiBFuLAGo2e4CC2BJ2f'
          }
        });
        const coins = await response.json();

        // Prepare data for chart
        const labels = [];
        const datasets = coins.map(coin => ({
          label: coin.name,
          data: [], // Initialize with empty data
          borderColor: getRandomColor(),
          backgroundColor: getRandomColor(0.2),
          fill: true,
          borderWidth: 1,
        }));

        // Fetch historical data for each coin
        const historicalDataPromises = coins.map(async (coin) => {
          const historicalResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=30`, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              'x-cg-demo-api-key': 'CG-iy1aPFiBFuLAGo2e4CC2BJ2f'
            }
          });
          const historicalData = await historicalResponse.json();
          return {
            id: coin.id,
            prices: historicalData.prices
          };
        });

        const historicalDataResults = await Promise.all(historicalDataPromises);

        // Format data for chart
        historicalDataResults.forEach((result, index) => {
          const { prices } = result;
          const formattedData = prices.map(([timestamp, price]) => ({ x: new Date(timestamp).toLocaleDateString(), y: price }));
          datasets[index].data = formattedData;
        });

        const allLabels = historicalDataResults[0].prices.map(([timestamp]) => new Date(timestamp).toLocaleDateString());
        setChartData({
          labels: allLabels,
          datasets
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching market cap data:', error);
        setLoading(false);
      }
    };

    fetchMarketCapData();
  }, []);

  const getRandomColor = (alpha = 1) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '20px' }}>Top 5 Coins by Total Volume</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
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
                  return `${context.dataset.label}: $${context.raw.y.toFixed(2)}`;
                },
              },
            },
          },
          scales: {
            x: {
              type: 'category',
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
  );
};

export default MarketCapChart;
