import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Type definitions
interface FactorScores {
  [key: number]: number;
} 

interface TopFactor {
  number: number;
  name: string;
  score: number;
  description: string;
}

interface Results {
  factorScores: FactorScores;
  topFactor: TopFactor;
}

interface RadarChartProps {
  factorScores: FactorScores;
}

interface Point {
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  label: string;
  score: number;
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const responses = location.state?.responses || []; // Get responses from state

  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Factor mappings (0-indexed to match array positions)
  const questionToFactor: { [key: number]: number } = {
    // Factor mappings
    5: 1, 10: 1, 1: 1, // q6, q11, q2
    13: 2, 9: 2, 6: 2, // q14, q10, q7
    22: 3, 21: 3, 15: 3, // q23, q22, q16
    8: 4, 11: 4, 2: 4, // q9, q12, q3
    19: 5, 4: 5, 12: 5, // q20, q5(new), q13
    3: 6, 18: 6, 23: 6, // q4, q19, q24
    16: 7, 0: 7, 7: 7, // q17, q1, q8
    20: 8, 17: 8, 14: 8 // q21, q18, q15
  };

  // Questions with negative weighting (0-indexed)
  const negativelyWeighted: Set<number> = new Set([4, 12]); // q5(new) and q13

  // Factor names
  const factorNames: { [key: number]: string } = {
    1: "Platform Trust",
    2: "Platform Resistance", 
    3: "Playlist Curator",
    4: "Anti-Mainstream",
    5: "Intentional Listener",
    6: "Popular Music Engagement",
    7: "Musical Explorer",
    8: "Social Music Engagement"
  };

  // Factor descriptions
  const factorDescriptions: { [key: number]: string } = {
    1: "You trust and rely on platform recommendations, enjoying algorithmic features like autoplay and feeling involved in how music is recommended to you.",
    2: "You prefer to maintain control over your music, avoiding platform suggestions and curated content in favor of your own choices.",
    3: "You actively create and manage playlists, taking an organized approach to curating your music collection.",
    4: "You're skeptical of mainstream popularity and platform motives, preferring underground artists and questioning algorithmic recommendations.",
    5: "You listen to music intentionally and thoughtfully, preferring full albums over individual tracks and considering your emotional state when choosing music.",
    6: "You stay current with popular trends, actively engage with new music discoveries, and save tracks for later listening.",
    7: "You actively seek out new and diverse music, exploring different genres and artists you haven't heard before.",
    8: "You engage with music socially and physically, creating playlists for friends, collecting physical formats, and using music for emotional understanding."
  };

  const fivePointIndices: Set<number> = new Set(Array.from({length: 9}, (_, i) => i + 15)); // questions 16-24

  useEffect(() => {
    if (responses.length === 0) {
      setError('No responses provided.');
      setLoading(false);
      return;
    }

    const factorScores = calculateFactorScores(responses);
    setResults(factorScores);
    setLoading(false);
  }, [responses]);


  const calculateFactorScores = (responses: (number | null)[]): Results => {
    // Initialize factor scores
    const factorScores: FactorScores = {};
    const factorQuestionCounts: { [key: number]: number } = {};
    
    for (let i = 1; i <= 8; i++) {
      factorScores[i] = 0;
      factorQuestionCounts[i] = 0;
    }

    // Calculate scores for each question
    for (let i = 0; i < responses.length; i++) {
      if (responses[i] === null) continue;

      const factor = questionToFactor[i];
      if (!factor) continue;

      let normalizedScore: number;
      const responseValue = responses[i] as number;

      // Normalize scores to 0-1 scale
      if (fivePointIndices.has(i)) {
        normalizedScore = (responseValue - 1) / 4; // 5-point: 1-5 -> 0-1
      } else {
        normalizedScore = (responseValue - 1) / 6; // 7-point: 1-7 -> 0-1
      }

      // Apply negative weighting if applicable
      if (negativelyWeighted.has(i)) {
        normalizedScore = 1 - normalizedScore;
      }

      factorScores[factor] += normalizedScore;
      factorQuestionCounts[factor]++;
    }

    // Average scores by number of questions per factor
    for (let factor in factorScores) {
      const factorNum = parseInt(factor);
      if (factorQuestionCounts[factorNum] > 0) {
        factorScores[factorNum] = factorScores[factorNum] / factorQuestionCounts[factorNum];
      }
    }

    // Find top factor
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
        description: factorDescriptions[topFactorNumber]
      }
    };
  };

  // Simple radar chart component
  const RadarChart: React.FC<RadarChartProps> = ({ factorScores }) => {
    const size = 300;
    const center = size / 2;
    const maxRadius = center - 40;
    const factors = Object.keys(factorScores);
    
    // Calculate points for each factor
    const points: Point[] = factors.map((factor, index) => {
      const angle = (index * 2 * Math.PI) / factors.length - Math.PI / 2;
      const score = factorScores[parseInt(factor)];
      const radius = score * maxRadius;
      
      return {
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius,
        labelX: center + Math.cos(angle) * (maxRadius + 20),
        labelY: center + Math.sin(angle) * (maxRadius + 20),
        label: factorNames[parseInt(factor)],
        score: score
      };
    });

    // Create background circles
    const backgroundCircles = [0.2, 0.4, 0.6, 0.8, 1.0].map((level: number) => (
      <circle
        key={level}
        cx={center}
        cy={center}
        r={level * maxRadius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    ));

    // Create axis lines
    const axisLines = points.map((point: Point, index: number) => (
      <line
        key={index}
        x1={center}
        y1={center}
        x2={center + Math.cos((index * 2 * Math.PI) / factors.length - Math.PI / 2) * maxRadius}
        y2={center + Math.sin((index * 2 * Math.PI) / factors.length - Math.PI / 2) * maxRadius}
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    ));

    // Create the data polygon
    const pathData = points.map((point: Point, index: number) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';

    return (
      <div className="radar-chart-container">
        <svg width={size} height={size} className="radar-chart">
          {backgroundCircles}
          {axisLines}
          
          <path
            d={pathData}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
          />
          
          {points.map((point: Point, index: number) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="rgb(59, 130, 246)"
              />
              <text
                x={point.labelX}
                y={point.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-semibold"
                fill="rgb(75, 85, 99)"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="results-container">
        <div className="loading">Loading your results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-container">
        <div className="error">No results to display</div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h1 className="results-title">Your Music Listening Profile</h1>
      
      <div className="primary-result">
        <h2 className="primary-factor-title">You are a: {results.topFactor.name}</h2>
        <div className="primary-score">
          Score: {(results.topFactor.score * 100).toFixed(1)}%
        </div>
        <p className="factor-description">
          {results.topFactor.description}
        </p>
      </div>

      <div className="radar-section">
        <h3 className="section-title">Your Complete Profile</h3>
        <RadarChart factorScores={results.factorScores} />
      </div>

      <div className="detailed-scores">
        <h3 className="section-title">Detailed Factor Scores</h3>
        <div className="factor-grid">
          {Object.entries(results.factorScores)
            .sort(([,a], [,b]) => b - a)
            .map(([factor, score]: [string, number]) => (
            <div key={factor} className="factor-item">
              <div className="factor-name">{factorNames[parseInt(factor)]}</div>
              <div className="factor-bar">
                <div 
                  className="factor-fill"
                  style={{ width: `${score * 100}%` }}
                />
              </div>
              <div className="factor-percentage">{(score * 100).toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={() => window.location.reload()} 
        className="retake-button"
      >
        View Updated Results
      </button>
    </div>
  );
};

export default ResultsPage;