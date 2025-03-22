// src/components/PreviousCaptures.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../styles/PreviousCaptures.css';

const PreviousCaptures = () => {
  const captures = [
    { id: 1, pressure: 1013, ph: 7.1, process: 'Carbon Absorption', timestamp: '2025-03-18' },
    { id: 2, pressure: 1015, ph: 7.3, process: 'Carbon Storage', timestamp: '2025-03-19' },
    { id: 3, pressure: 1012, ph: 7.2, process: 'Carbon Utilization', timestamp: '2025-03-20' },
  ];

  // Create gradient fills dynamically using canvas context
  const getGradientFill = (ctx, chartArea, colorStart, colorEnd) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
  };

  const chartData = {
    labels: captures.map((c) => c.timestamp),
    datasets: [
      {
        label: 'Pressure (hPa)',
        data: captures.map((c) => c.pressure),
        borderColor: '#27ae60', // Green line
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null; // Avoid errors during initial render
          return getGradientFill(ctx, chartArea, 'rgba(39, 174, 96, 0.4)', 'rgba(39, 174, 96, 0)');
        },
        fill: true,
        tension: 0.4, // Smooth curves
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#27ae60',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
      {
        label: 'pH Value',
        data: captures.map((c) => c.ph),
        borderColor: '#3498db', // Blue line
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          return getGradientFill(ctx, chartArea, 'rgba(52, 152, 219, 0.4)', 'rgba(52, 152, 219, 0)');
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#3498db',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: '#2c3e50',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(44, 62, 80, 0.9)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 5,
        borderWidth: 1,
        borderColor: '#27ae60',
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#34495e', font: { size: 12 } },
      },
      y: {
        grid: { color: 'rgba(236, 240, 241, 0.5)', borderDash: [5, 5] },
        ticks: { color: '#34495e', font: { size: 12 } },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    maintainAspectRatio: false, // Allow custom height
  };

  return (
    <div className="captures-page-container">
      <div className="captures-container">
        <h2>Previous Captures</h2>
        <div className="captures-list">
          {captures.map((capture) => (
            <div key={capture.id} className="capture-item">
              <span>{capture.timestamp}</span>
              <span>{capture.process}</span>
              <span>Pressure: {capture.pressure} hPa</span>
              <span>pH: {capture.ph}</span>
            </div>
          ))}
        </div>
        <div className="chart">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default PreviousCaptures;