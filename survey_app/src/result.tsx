import React, { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import './result.css';

type FactorScores = Record<number, number>;
type FactorNames = Record<number, string>;
type FactorImages = Record<number, string>;

type TopFactor = {
  number: number;
  name: string;
  score: number;
  description: string;
};

type Results = {
  factorScores: FactorScores;
  topFactor: TopFactor;
};

const RADIAN = Math.PI / 180;

// Robust tick renderer: use x/y when provided; otherwise compute from cx/cy + angle
interface AngleLabelProps {
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  payload?: {
    value?: string;
    coordinate?: number;
  };
  radius?: number;
  outerRadius?: number;
}

const AngleLabel = (props: AngleLabelProps) => {
  const { x, y, cx, cy, payload } = props;
  const OFFSET = 20;

  // If x/y exist, nudge label outward along vector from center
  if (
    typeof x === 'number' &&
    typeof y === 'number' &&
    typeof cx === 'number' &&
    typeof cy === 'number'
  ) {
    const vx = x - cx;
    const vy = y - cy;
    const len = Math.sqrt(vx * vx + vy * vy) || 1;
    const tx = x + (vx / len) * OFFSET;
    const ty = y + (vy / len) * OFFSET;

    return (
      <text
        x={tx}
        y={ty}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#111827"
        fontSize={12}
        fontWeight={600}
      >
        {payload?.value}
      </text>
    );
  }

  // Fallback: compute using center + angle (payload.coordinate is degrees)
  const angle = typeof payload?.coordinate === 'number' ? payload.coordinate : 0;
  const cx0 = typeof props.cx === 'number' ? props.cx : 0;
  const cy0 = typeof props.cy === 'number' ? props.cy : 0;
  const baseRadius =
    (typeof props.radius === 'number' ? props.radius : 0) ||
    (typeof props.outerRadius === 'number' ? props.outerRadius : 0);

  const r = baseRadius + OFFSET;
  const tx = cx0 + r * Math.cos(-angle * RADIAN);
  const ty = cy0 + r * Math.sin(-angle * RADIAN);

  return (
    <text
      x={tx}
      y={ty}
      textAnchor="middle"
      dominantBaseline="central"
      fill="#111827"
      fontSize={12}
      fontWeight={600}
    >
      {payload?.value}
    </text>
  );
};

const ResultsPage = () => {
  const shareableRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Get responses from navigation state, fallback to test data if not available
  const responses = location.state?.responses || Array.from({ length: 24 }, () => Math.floor(Math.random() * 5) + 2);
  
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStraightlined, setIsStraightlined] = useState(false);

  // Correct mapping based on your factor definitions
  // Questions are 0-indexed, so subtract 1 from question numbers
  const questionToFactor: Record<number, number> = {
    5: 1, 10: 1, 1: 1,
    13: 2, 9: 2, 6: 2,
    22: 3, 21: 3, 15: 3,
    8: 4, 11: 4, 2: 4,
    19: 5, 4: 5, 12: 5,
    3: 6, 18: 6, 23: 6,
    16: 7, 0: 7, 7: 7,
    20: 8, 17: 8, 14: 8,
  };

  // Questions that should be reverse-scored
  const negativelyWeighted = new Set([12]);
  
  const factorNames: FactorNames = {
    1: "Platform Trust",
    2: "Platform Control",
    3: "Playlist Creator",
    4: "Independent Listener",
    5: "Deep Listener",
    6: "Discovery Engaged",
    7: "Explorer",
    8: "Physical & Emotional",
  };

  const factorDescriptions: FactorNames = {
    1: "You trust and embrace platform recommendations and algorithmic curation",
    2: "You prefer maintaining control over your music choices",
    3: "You actively create and curate playlists for yourself and others",
    4: "You value independence in your music taste and are skeptical of mainstream",
    5: "You engage deeply with music through albums and emotional reflection",
    6: "You actively discover and engage with new music and trends",
    7: "You explore diverse genres and unfamiliar artists",
    8: "You connect with music physically and emotionally",
  };

  // Indices 15-23 are 5-point questions (0-indexed)
  const fivePointIndices = new Set([15, 16, 17, 18, 19, 20, 21, 22, 23]);

  useEffect(() => {
    // Check for straightlining (all neutral responses)
    const isNeutral = responses.every((response: number, index: number) => {
      if (response === null) return false;
      return fivePointIndices.has(index) ? response === 3 : response === 4;
    });

    if (isNeutral) {
      setIsStraightlined(true);
      setLoading(false);
      return;
    }

    const calculatedResults = calculateFactorScores(responses);
    setResults(calculatedResults);
    setLoading(false);
  }, [responses]);

  const calculateFactorScoresForResponse = (responses: number[]): FactorScores => {
    const factorScores: FactorScores = {};
    const factorQuestionCounts: Record<number, number> = {};
    
    for (let i = 1; i <= 8; i++) {
      factorScores[i] = 0;
      factorQuestionCounts[i] = 0;
    }
    
    for (let i = 0; i < responses.length; i++) {
      if (responses[i] === null) continue;
      
      const factor = questionToFactor[i];
      if (!factor) continue;
      
      let normalizedScore: number;
      const responseValue = responses[i];
      
      if (fivePointIndices.has(i)) {
        normalizedScore = (responseValue - 1) / 4;
      } else {
        normalizedScore = (responseValue - 1) / 6;
      }
      
      if (negativelyWeighted.has(i)) {
        normalizedScore = 1 - normalizedScore;
      }
      
      factorScores[factor] += normalizedScore;
      factorQuestionCounts[factor]++;
    }
    
    for (const factor in factorScores) {
      const f = parseInt(factor);
      if (factorQuestionCounts[f] > 0) {
        factorScores[f] = factorScores[f] / factorQuestionCounts[f];
      }
    }
    
    return factorScores;
  };

  const calculateFactorScores = (responses: number[]): Results => {
    const factorScores = calculateFactorScoresForResponse(responses);
    
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
        score: factorScores[topFactorNumber],
        description: factorDescriptions[topFactorNumber],
      },
    };
  };

  const handleDownloadImage = async () => {
    if (!shareableRef.current) return;
    try {
      const html2canvas = (await import("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm")).default;
      const canvas = await html2canvas(shareableRef.current, { backgroundColor: '#fff', scale: 2 });
      const link = document.createElement('a');
      link.download = 'my-music-profile.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Unable to generate image.');
    }
  };

  const factorImages: FactorImages = {
    1: '/images/smart-speaker.gif',
    2: '/images/wired-earbuds.gif',
    3: '/images/jukebox.gif',
    4: '/images/noise-cancelling-headphones.gif',
    5: '/images/studio-headphones.gif',
    6: '/images/airpods.gif',
    7: '/images/vinyl-crate.gif',
    8: '/images/boombox.gif',
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (isStraightlined)
    return <div className="boring">Your listener profile is ... boring. Please try again!</div>;
  if (!results) return <div>No results to display</div>;

  // Prepare data for recharts radar chart
  const radarData = Object.keys(results.factorScores).map(key => ({
    factor: factorNames[parseInt(key)],
    score: results.factorScores[parseInt(key)] * 100,
    fullMark: 100
  }));

  return (
    <div className="results-page">
      <div ref={shareableRef} className="results-layout">
        <div className="radar-section">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData} outerRadius="70%">
              <PolarGrid stroke="#d1d5db" strokeWidth={1} />
              <PolarAngleAxis
                dataKey="factor"
                tick={<AngleLabel />}
                tickLine={false}
              />
              <PolarRadiusAxis
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                dataKey="score"
                stroke="#1f2937"
                fill="none"
                fillOpacity={0}
                strokeWidth={3}
                dot={{ fill: '#1f2937', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                isAnimationActive={false}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="results-info">
          <h1>Your Music Listening Profile</h1>
          <h2>You are: {results.topFactor.name}</h2>
          <p className="score">Score: {(results.topFactor.score * 100).toFixed(1)}%</p>
          <p>{results.topFactor.description}</p>
          <img src={factorImages[results.topFactor.number]} alt={results.topFactor.name} />
          <p>Drawings by Katie Lam</p>
        </div>
      </div>

      <div className="share-section">
        <p>Share your results! Use the button below to download, or take a screenshot.</p>
        <button className="download-btn" onClick={handleDownloadImage}>
          <Download size={20} /> Download Results
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;