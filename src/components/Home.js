// src/components/Home.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GaugeChart from 'react-gauge-chart';
import '../styles/Home.css';
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

const Home = () => {
  const navigate = useNavigate();
  
  // State for Firebase data
  const [pressure, setPressure] = useState(900); // Default value
  const [ph, setPh] = useState(0); // Default value
  const [temperature, setTemperature] = useState(0); // Default value
  const [pump1Status, setPump1Status] = useState('OFF');
  const [pump2Status, setPump2Status] = useState('OFF');

  // Fetch data from Firebase
  useEffect(() => {
    const dataRef = ref(db, 'EcoSmart');
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPressure(data.Pressure || 900);
        setPh(data.pH || 0);
        setTemperature(data.Temperature || 0);
        setPump1Status(data.Pump1_Status || 'OFF');
        setPump2Status(data.Pump2_Status || 'OFF');
      }
    }, (error) => {
      console.error("Error fetching Firebase data:", error);
    });

    return () => unsubscribe();
  }, []);

  // Calculate gauge percentages (normalize values to 0-1)
  const pressurePercent = (pressure - 900) / (1100 - 900); // Range: 900-1100 hPa
  const phPercent = ph / 14; // Range: 0-14
  const tempPercent = (temperature - 0) / (50 - 0); // Assuming range: 0-50°C, adjust as needed

  // Determine current process based on pump status
  const determineCurrentProcess = () => {
    if (pump1Status === 'ON') {
      return 'Collecting CO2 and Reaction Phase';
    } else if (pump2Status === 'ON') {
      return 'Collecting End Product';
    } else {
      return 'Detecting CO2'; // Default when both pumps are OFF
    }
  };

  const currentProcess = determineCurrentProcess();

  // Process steps and current step logic
  const processes = [
    'Detecting CO2',
    'Collecting CO2 and Reaction Phase',
    'Collecting End Product'
  ];
  const currentStep = processes.indexOf(currentProcess);

  return (
    <div className="home-container">
      <div className="content">
        <div className="meters">
          <div className="meter">
            <h3>Pressure (hPa)</h3>
            <GaugeChart
              id="pressure-gauge"
              nrOfLevels={20}
              percent={pressurePercent}
              arcWidth={0.3}
              needleColor="#000"
              colors={['#FF0000', '#FFFF00', '#00FF00']}
              textColor="#000"
              formatTextValue={() => `${pressure.toFixed(2)} hPa`}
            />
          </div>
          <div className="meter">
            <h3>pH Value</h3>
            <GaugeChart
              id="ph-gauge"
              nrOfLevels={20}
              percent={phPercent}
              arcWidth={0.3}
              needleColor="#000"
              colors={['#FF0000', '#FFFF00', '#00FF00']}
              textColor="#000"
              formatTextValue={() => `${ph.toFixed(2)}`}
            />
          </div>
          <div className="meter">
            <h3>Temperature (°C)</h3>
            <GaugeChart
              id="temp-gauge"
              nrOfLevels={20}
              percent={tempPercent}
              arcWidth={0.3}
              needleColor="#000"
              colors={['#FF0000', '#FFFF00', '#00FF00']}
              textColor="#000"
              formatTextValue={() => `${temperature.toFixed(2)} °C`}
            />
          </div>
        </div>
        <div className="current-process-highlight">
          <div className="current-process">
            <h3>Current Process</h3>
            <div className="process-tracker">
              {processes.map((process, index) => (
                <div
                  key={index}
                  className={`process-step ${index <= currentStep ? 'active' : ''} ${
                    index === currentStep ? 'current' : ''
                  }`}
                >
                  <div className="step-circle">{index < currentStep ? '✔' : index + 1}</div>
                  <span>{process}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sections">
          <div className="section" onClick={() => navigate('/previous-captures')}>
            Previous Captures
          </div>
          <div className="section" onClick={() => navigate('/recommendations')}>
            Recommendations
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;