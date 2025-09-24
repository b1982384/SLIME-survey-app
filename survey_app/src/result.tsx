import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './result.css';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const responses = location.state?.responses || [];

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStraightlined, setIsStraightlined] = useState(false);

  // Factor mappings
  const questionToFactor = {
    0: 1, 1: 1, 2: 1, // Factor 1
    3: 2, 4: 2, 5: 2, // Factor 2
    6: 3, 7: 3, 8: 3, // Factor 3
    9: 4, 10: 4, 11: 4, // Factor 4
    12: 5, 13: 5, 14: 5, // Factor 5
    15: 6, 16: 6, 17: 6, // Factor 6
    18: 7, 19: 7, 20: 7, // Factor 7
    21: 8, 22: 8, 23: 8, // Factor 8
  };

  const negativelyWeighted = new Set([4, 12]); // Example: Questions with negative weighting
  const factorNames = {
    1: "Algorithmic Openness",
    2: "Algorithmic Skepticism",
    3: "Hoarding",
    4: "Individualistic Musicking",
    5: "Deep Listening",
    6: "Musical Omnivorism",
    7: "Searching",
    8: "Curation & Sociality",
  };

  const factorDescriptions = {
    1: "Algorithmic Openness - Smart Speaker. Like a Smart Speaker, you’re always ready to hear what’s next. You trust the algorithm to guide you to fresh discoveries that still align with your personal tastes.",
    2: "Algorithmic Skepticism - Wired Earbuds. You’re Wired Earbuds — simple, direct, and in full control. No autoplay, no surprises: just the music you choose, the way you want it.",
    3: "Hoarding – Jukebox. Like a Jukebox, you are overflowing with songs, playlists, and hidden gems. Each track is catalogued into your personal archive, and you’re always ready to play the perfect one on demand.",
    4: "Individualistic Musicking – Noise-Cancelling Headphones. You tune out the noise of popularity and platforms. Your listening is private, intentional, and completely yours.",
    5: "Deep Listening – Studio Headphones. Like Studio Headphones your listening is tuned for clarity and depth. You listen closely, savor full albums, and treat music like a rich, immersive world.",
    6: "Musical Omnivorism – AirPods. You’re AirPods, a trendy listener who is always bouncing between moods and genres with ease. Your music is woven into your everyday life.",
    7: "Searching – Vinyl Crate. You are a Vinyl Crate, always digging for the next discovery. You love flipping through the unfamiliar and novel, hunting for gems others might overlook.",
    8: "Curation & Sociality – Boombox. Bold and sociable, you’re the Boombox. Music isn’t just for you — it’s a vibe you broadcast, connecting people and setting the mood.",
  };

  const fivePointIndices = new Set(Array.from({ length: 9 }, (_, i) => i + 15)); // Questions 16-24

  useEffect(() => {
    if (responses.length === 0) {
      setError('No responses provided.');
      setTimeout(() => navigate('/questions'), 3000);
      return;
    }

    // Check if the user straightlined (all responses normalize to 0.5)
    const isNeutral = responses.every((response, index) => {
      if (fivePointIndices.has(index)) {
        return (response - 1) / 4 === 0.5; // 5-point scale
      } else {
        return (response - 1) / 6 === 0.5; // 7-point scale
      }
    });

    if (isNeutral) {
      setIsStraightlined(true);
      setLoading(false);
      return;
    }

    const factorScores = calculateFactorScores(responses);
    setResults(factorScores);
    setLoading(false);
  }, [responses, navigate]);

  const calculateFactorScores = (responses) => {
    const factorScores = {};
    const factorQuestionCounts = {};

    // Initialize scores and counts
    for (let i = 1; i <= 8; i++) {
      factorScores[i] = 0;
      factorQuestionCounts[i] = 0;
    }

    // Calculate scores for each question
    for (let i = 0; i < responses.length; i++) {
      if (responses[i] === null) continue;

      const factor = questionToFactor[i];
      if (!factor) continue;

      let normalizedScore;
      const responseValue = responses[i];

      // Normalize scores to a 0-1 scale
      if (fivePointIndices.has(i)) {
        normalizedScore = (responseValue - 1) / 4; // 5-point scale
      } else {
        normalizedScore = (responseValue - 1) / 6; // 7-point scale
      }

      // Apply negative weighting if applicable
      if (negativelyWeighted.has(i)) {
        normalizedScore = 1 - normalizedScore;
      }

      factorScores[factor] += normalizedScore;
      factorQuestionCounts[factor]++;
    }

    // Average scores by the number of questions per factor
    for (let factor in factorScores) {
      const factorNum = parseInt(factor);
      if (factorQuestionCounts[factorNum] > 0) {
        factorScores[factorNum] = factorScores[factorNum] / factorQuestionCounts[factorNum];
      }
    }

    // Find the top factor
    const topFactorEntry = Object.entries(factorScores).reduce((a, b) =>
      factorScores[parseInt(a[0])] > factorScores[parseInt(b[0])] ? a : b
    );

    const topFactorNumber = parseInt(topFactorEntry[0]);

    return {
      factorScores,
      topFactor: {
        number: topFactorNumber,
        name: factorNames[topFactorNumber],
        score: topFactorEntry[1],
        description: factorDescriptions[topFactorNumber],
      },
    };
  };

  const RadarChart = ({ factorScores }) => {
    const size = 400; // Radar chart size
    const padding = 50; // Extra padding for labels
    const center = size / 2;
    const maxRadius = center - 40;
    const factors = Object.keys(factorScores);
  
    const points = factors.map((factor, index) => {
      const angle = (index * 2 * Math.PI) / factors.length - Math.PI / 2;
      const score = factorScores[parseInt(factor)];
      const radius = score * maxRadius;
  
      return {
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius,
        labelX: center + Math.cos(angle) * (maxRadius + 20),
        labelY: center + Math.sin(angle) * (maxRadius + 20),
        label: factorNames[parseInt(factor)],
        score: score,
      };
    });
  
    const backgroundCircles = [0.2, 0.4, 0.6, 0.8, 1.0].map((level) => (
      <circle
        key={level}
        cx={center}
        cy={center}
        r={level * maxRadius}
        className="background-circle"
      />
    ));
  
    const axisLines = points.map((point, index) => (
      <line
        key={index}
        x1={center}
        y1={center}
        x2={center + Math.cos((index * 2 * Math.PI) / factors.length - Math.PI / 2) * maxRadius}
        y2={center + Math.sin((index * 2 * Math.PI) / factors.length - Math.PI / 2) * maxRadius}
        className="axis-line"
      />
    ));
  
    const pathData = points.map((point, index) =>
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';
  
    return (
      <div className="radar-chart-container">
        <svg
          width={size + padding}
          height={size + padding}
          viewBox={`0 0 ${size + padding} ${size + padding}`}
          className="radar-chart"
        >
          <g transform={`translate(${padding / 2}, ${padding / 2})`}>
            {backgroundCircles}
            {axisLines}
            <path d={pathData} />
            {points.map((point, index) => (
              <g key={index}>
                <circle cx={point.x} cy={point.y} r="4" />
                <text
                  x={point.labelX}
                  y={point.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {point.label}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    );
  };