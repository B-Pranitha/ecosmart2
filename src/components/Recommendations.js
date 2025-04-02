// src/components/Recommendations.js
// src/components/Recommendations.js
import React, { useState } from 'react';
import '../styles/Recommendations.css';

const recommendationsData = [
  {
    id: 1,
    title: 'Enhanced Oil Recovery (EOR)',
    description: 'Use captured CO2 for enhanced oil recovery.',
    details: 'Injecting CO2 into oil fields increases pressure, recovering 5-15% more oil.',
  },
  {
    id: 2,
    title: 'Biofuels from Microalgae',
    description: 'Convert CO2 into biofuels using microalgae.',
    details: 'Microalgae absorb CO2 and produce lipids for sustainable fuel, reducing emissions.',
  },
  {
    id: 3,
    title: 'Sustainable Concrete',
    description: 'Incorporate CO2 into concrete production.',
    details: 'CO2 mineralizes in concrete, enhancing strength and sequestering carbon.',
  },
  {
    id: 4,
    title: 'Chemical Synthesis',
    description: 'Utilize CO2 for methanol production.',
    details: 'CO2 reacts with hydrogen to create methanol, a versatile chemical and fuel.',
  },
  {
    id: 5,
    title: 'Carbon-Neutral Plastics',
    description: 'Transform CO2 into polymers for plastic production.',
    details: 'CO2 can be combined with catalysts to create durable, recyclable plastics.',
  },
  {
    id: 6,
    title: 'CO2-to-Fertilizer Conversion',
    description: 'Use CO2 to produce carbon-based fertilizers.',
    details: 'CO2 can be processed into urea or other compounds to enhance agricultural yields.',
  },
];

const Recommendations = () => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="recommendations-page-container">
      <div className="recommendations-container">
        <h2 className="recommendations-title">CO2 Utilization Recommendations</h2>
        <div className="recommendations-grid">
          {recommendationsData.map((rec) => (
            <div
              key={rec.id}
              className={`recommendation-card ${expandedId === rec.id ? 'expanded' : ''}`}
              onClick={() => toggleExpand(rec.id)}
            >
              <h3 className="card-title">{rec.title}</h3>
              <p className="card-description">{rec.description}</p>
              {expandedId === rec.id && (
                <div className="card-details">
                  <p>{rec.details}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;