import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const CoinDetails = ({ coin }) => {
  const [coinDetails, setCoinDetails] = useState(null);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
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
    };

    if (coin) {
      fetchDetails();
    }
  }, [coin]);

  return (
    <div>
      {coinDetails && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'left',
          alignContent:'left',
          margin: '20px auto',
          maxWidth: '600px' }}>
          <h2><b>{coinDetails.name}</b></h2><br/>
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
          <p>Price Change % 1H: {coinDetails.market_data.price_change_percentage_1h_in_currency.usd}%</p>
          {/* <p>7D Sparkline:</p> */}
          {coinDetails.market_data.sparkline_7d && (
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
          )}
          {chartData.prices && (
            <div>
              <h3>Price vs. Time (Last 24H)</h3>
              <Line
                data={{
                  labels: chartData.prices.map(([timestamp]) => new Date(timestamp).toLocaleTimeString()),
                  datasets: [
                    {
                      label: 'Price',
                      data: chartData.prices.map(([, price]) => price),
                      borderColor: '#33c1ff',
                      backgroundColor: 'rgba(51, 193, 255, 0.2)',
                      fill: true,
                    },
                  ],
                }}
                options={{ responsive: true }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoinDetails;
