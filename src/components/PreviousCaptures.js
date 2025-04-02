// src/components/PreviousCaptures.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../styles/PreviousCaptures.css';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdgnpxd3ZsLUn0Cvwc1MkYFuhfYBpID1I",
  authDomain: "ecosmart-54ac6.firebaseapp.com",
  databaseURL: "https://ecosmart-54ac6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ecosmart-54ac6",
  storageBucket: "ecosmart-54ac6.firebasestorage.app",
  messagingSenderId: "834837781787",
  appId: "1:834837781787:web:e07308f1c887beab7b87be",
  measurementId: "G-HE4FYZCJGB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const PreviousCaptures = () => {
  // State for reaction phase records (3 days)
  const [reactionRecords, setReactionRecords] = useState([]);
  // State for current day graph data
  const [graphData, setGraphData] = useState({
    labels: [],
    ph: [],
    pressure: [],
    temperature: []
  });

  // Helper to get current date in YYYY-MM-DD format
  const getDateString = (date) => date.toISOString().split('T')[0];

  // Initialize records for 3 days if not already set
  useEffect(() => {
    const today = new Date();
    const initialRecords = [
      { date: getDateString(new Date(today - 2 * 24 * 60 * 60 * 1000)), startTime: null, endTime: null },
      { date: getDateString(new Date(today - 1 * 24 * 60 * 60 * 1000)), startTime: null, endTime: null },
      { date: getDateString(today), startTime: null, endTime: null }
    ];
    setReactionRecords(initialRecords);
  }, []);

  // Fetch Firebase data and update records/graph
  useEffect(() => {
    const dataRef = ref(db, 'EcoSmart');
    let lastPump1Status = 'OFF';
    let lastPump2Status = 'OFF';

    const interval = setInterval(() => {
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const currentTime = new Date().toLocaleTimeString();
          const today = getDateString(new Date());

          // Update reaction records
          setReactionRecords((prevRecords) => {
            const updatedRecords = [...prevRecords];
            const todayRecord = updatedRecords.find((r) => r.date === today);

            if (data.Pump1_Status === 'ON' && lastPump1Status === 'OFF') {
              todayRecord.startTime = currentTime; // Reaction phase started
            }
            if (data.Pump2_Status === 'ON' && lastPump2Status === 'OFF' && todayRecord.startTime) {
              todayRecord.endTime = currentTime; // Reaction phase ended
            }

            lastPump1Status = data.Pump1_Status;
            lastPump2Status = data.Pump2_Status;
            return updatedRecords;
          });

          // Update graph data for current day (every minute)
          setGraphData((prevData) => {
            const newLabels = [...prevData.labels, currentTime].slice(-60); // Last 60 minutes
            const newPh = [...prevData.ph, data.pH || 0].slice(-60);
            const newPressure = [...prevData.pressure, data.Pressure || 900].slice(-60);
            const newTemperature = [...prevData.temperature, data.Temperature || 0].slice(-60);

            return {
              labels: newLabels,
              ph: newPh,
              pressure: newPressure,
              temperature: newTemperature
            };
          });
        }
      }, (error) => {
        console.error("Error fetching Firebase data:", error);
      });
    }, 60000); // Update every minute (60000 ms)

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Gradient fill for chart
  const getGradientFill = (ctx, chartArea, colorStart, colorEnd) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
  };

  // Chart data configuration
  const chartData = {
    labels: graphData.labels,
    datasets: [
      {
        label: 'pH',
        data: graphData.ph,
        borderColor: '#3498db', // Blue
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          return chartArea ? getGradientFill(ctx, chartArea, 'rgba(52, 152, 219, 0.4)', 'rgba(52, 152, 219, 0)') : null;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#3498db',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Pressure (hPa)',
        data: graphData.pressure,
        borderColor: '#27ae60', // Green
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          return chartArea ? getGradientFill(ctx, chartArea, 'rgba(39, 174, 96, 0.4)', 'rgba(39, 174, 96, 0)') : null;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#27ae60',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Temperature (°C)',
        data: graphData.temperature,
        borderColor: '#e74c3c', // Red
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          return chartArea ? getGradientFill(ctx, chartArea, 'rgba(231, 76, 60, 0.4)', 'rgba(231, 76, 60, 0)') : null;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#e74c3c',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
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
        title: {
          display: true,
          text: 'Time',
          color: '#34495e',
          font: { size: 14 },
        },
        grid: { display: false },
        ticks: { color: '#34495e', font: { size: 12 }, maxTicksLimit: 10 },
      },
      y: {
        title: {
          display: true,
          text: 'Values (pH, hPa, °C)',
          color: '#34495e',
          font: { size: 14 },
        },
        grid: { color: 'rgba(236, 240, 241, 0.5)', borderDash: [5, 5] },
        ticks: { color: '#34495e', font: { size: 12 } },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="captures-page-container">
      <div className="captures-container">
        <h2>Previous Captures</h2>
        <div className="captures-list">
          {reactionRecords.map((record, index) => (
            <div key={index} className="capture-item">
              <span>Date: {record.date}</span>
              <span>Reaction Started: {record.startTime || 'Not Started'}</span>
              <span>Reaction Ended: {record.endTime || 'Not Ended'}</span>
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