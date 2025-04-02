import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GaugeChart from "react-gauge-chart";
import "../styles/Home.css";
import { db } from "../firebase"; // Import db from firebase.js
import { ref, onValue } from "firebase/database";

const Home = () => {
  const navigate = useNavigate();
  const [pressure, setPressure] = useState(900);
  const [ph, setPh] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [pump1Status, setPump1Status] = useState("OFF");
  const [pump2Status, setPump2Status] = useState("OFF");

  useEffect(() => {
    const dataRef = ref(db, "EcoSmart");
    onValue(
      dataRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setPressure(data.Pressure || 900);
          setPh(data.pH || 0);
          setTemperature(data.Temperature || 0);
          setPump1Status(data.Pump1_Status || "OFF");
          setPump2Status(data.Pump2_Status || "OFF");
        }
      },
      (error) => {
        console.error("Error fetching Firebase data:", error);
      }
    );
  }, []);

  const pressurePercent = (pressure - 900) / (1100 - 900);
  const phPercent = ph / 14;
  const tempPercent = (temperature - 0) / (50 - 0);

  const determineCurrentProcess = () => {
    if (pump1Status === "ON") return "Collecting CO2 and Reaction Phase";
    if (pump2Status === "ON") return "Collecting End Product";
    return "Detecting CO2";
  };

  const currentProcess = determineCurrentProcess();
  const processes = [
    "Detecting CO2",
    "Collecting CO2 and Reaction Phase",
    "Collecting End Product",
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
              colors={["#FF0000", "#FFFF00", "#00FF00"]}
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
              colors={["#FF0000", "#FFFF00", "#00FF00"]}
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
              colors={["#FF0000", "#FFFF00", "#00FF00"]}
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
                  className={`process-step ${
                    index <= currentStep ? "active" : ""
                  } ${index === currentStep ? "current" : ""}`}
                >
                  <div className="step-circle">
                    {index < currentStep ? "✔" : index + 1}
                  </div>
                  <span>{process}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sections">
          <div
            className="section"
            onClick={() => navigate("/previous-captures")}
          >
            Previous Captures
          </div>
          <div className="section" onClick={() => navigate("/recommendations")}>
            Recommendations
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
