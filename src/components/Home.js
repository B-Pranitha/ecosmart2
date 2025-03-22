// src/components/Home.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GaugeChart from 'react-gauge-chart';
import { database } from '../firebase'; // Firebase setup
import { ref, onValue } from 'firebase/database';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [pressure, setPressure] = useState(0);
  const [ph, setPh] = useState(0);
  const [currentProcess, setCurrentProcess] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real-time data from Firebase
  useEffect(() => {
    const dataRef = ref(database, '/');

    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setPressure(data.pressure || 0);
          setPh(data.ph || 0);
          setCurrentProcess(data.process || 'Unknown');
          setError(null);
        } else {
          setError('No data found in database');
        }
        setLoading(false);
      },
      (error) => {
        setError('Failed to load data: ' + error.message);
        setLoading(false);
        console.error("Realtime Database error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Gauge percentage calculations
  const pressurePercent = (pressure - 900) / (1100 - 900);  // Adjust range as needed
  const phPercent = ph / 14;

  // Process tracking logic
  const processes = ['Detecting CO2', 'Capturing CO2', 'Reaction Phase'];
  const currentStep = processes.indexOf(currentProcess) !== -1 ? processes.indexOf(currentProcess) : 0;
  const progressPercent = ((currentStep) / (processes.length - 1)) * 100; // Dynamic progress %

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-container">
      <div className="content">
        {/* Gauges */}
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
              formatTextValue={() => `${ph.toFixed(1)}`}
            />
          </div>
        </div>

        {/* Process Tracking */}
        <div className="current-process-highlight">
          <div className="current-process">
            <h3>Current Process</h3>
            <div
              className="process-tracker"
              style={{ '--progress-width': `${progressPercent}%` }}
            >
              {processes.map((process, index) => (
                <div
                  key={index}
                  className={`process-step ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
                >
                  <div className="step-circle">
                    {index < currentStep ? '✔' : index + 1}
                  </div>
                  <span>{process}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
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


