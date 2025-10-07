import React, { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import './result.css'; // ✅ External CSS import

type FactorScores = Record<number, number>;
type FactorNames = Record<number, string>;
type QuestionToFactor = Record<number, number>;
type FactorImages = Record<number, string>;

type TopFactor = {
  number: number;
  name: string;
  score: number;
  description: string;
};

type Results = {
  factorScores: FactorScores;
  topFactor: TopFactor ;
};

type RadarChartProps = {
  factorScores: FactorScores;
  factorNames: FactorNames;
};

const RadarChart: React.FC<RadarChartProps> = ({ factorScores, factorNames }) => {
  const size = 400;
  const padding = 40;
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
    <circle key={level} cx={center} cy={center} r={level * maxRadius} fill="none" stroke="#e5e7eb" strokeWidth="1" />
  ));

  const axisLines = points.map((_point, index) => (
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

  const pathData = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ') + ' Z';

  return (
    <div className="radar-container">
      <svg width={size + padding} height={size + padding} viewBox={`0 0 ${size + padding} ${size + padding}`}>
        <g transform={`translate(${padding / 2}, ${padding / 2})`}>
          {backgroundCircles}
          {axisLines}
          <path d={pathData} fill="rgba(59, 130, 246, 0.3)" stroke="rgb(59, 130, 246)" strokeWidth="2" />
          {points.map((point, index) => (
            <g key={index}>
              <circle cx={point.x} cy={point.y} r="4" fill="rgb(59, 130, 246)" />
              <text
                x={point.labelX}
                y={point.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="600"
                fill="rgb(75, 85, 99)"
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

const ResultsPage = () => {
  const shareableRef = useRef<HTMLDivElement>(null);
  const [responses] = useState<number[]>(Array.from({ length: 24 }, () => Math.floor(Math.random() * 5) + 2));
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStraightlined, setIsStraightlined] = useState(false);

  const questionToFactor: QuestionToFactor = {
    0: 1, 1: 1, 2: 1,
    3: 2, 4: 2, 5: 2,
    6: 3, 7: 3, 8: 3,
    9: 4, 10: 4, 11: 4,
    12: 5, 13: 5, 14: 5,
    15: 6, 16: 6, 17: 6,
    18: 7, 19: 7, 20: 7,
    21: 8, 22: 8, 23: 8,
  };

  const negativelyWeighted = new Set([4, 12]);
  const factorNames: FactorNames = {
    1: "Algorithmically Open",
    2: "Algorithmically Skeptical",
    3: "A Music Hoarder",
    4: "An Individualistic Listener",
    5: "A Deep Listener",
    6: "A Musical Omnivore",
    7: "A Searcher",
    8: "A Curator & Social Listener",
  };

  const factorDescriptions: FactorNames = {
    1: "Algorithmic Openness - Smart Speaker...",
    2: "Algorithmic Skepticism - Wired Earbuds...",
    3: "Hoarding – Jukebox...",
    4: "Individualistic Musicking – Noise-Cancelling Headphones...",
    5: "Deep Listening – Studio Headphones...",
    6: "Musical Omnivorism – AirPods...",
    7: "Searching – Vinyl Crate...",
    8: "Curation & Sociality – Boombox...",
  };

  const fivePointIndices = new Set(Array.from({ length: 9 }, (_, i) => i + 15));

  useEffect(() => {
    const isNeutral = responses.every((response, index) => {
      if (fivePointIndices.has(index)) {
        return (response - 1) / 4 === 0.5;
      } else {
        return (response - 1) / 6 === 0.5;
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
  }, [responses]);

  const calculateFactorScores = (responses: number[]): Results => {
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
      if (negativelyWeighted.has(i)) normalizedScore = 1 - normalizedScore;
      factorScores[factor] += normalizedScore;
      factorQuestionCounts[factor]++;
    }
    for (const factor in factorScores) {
      const f = parseInt(factor);
      if (factorQuestionCounts[f] > 0) factorScores[f] = factorScores[f] / factorQuestionCounts[f];
    }
    const topFactorEntry = Object.entries(factorScores).reduce((a, b) =>
      factorScores[parseInt(a[0])] > factorScores[parseInt(b[0])] ? a : b
    );
    const topFactorNumber = parseInt(topFactorEntry[0]);
    return {
      factorScores,
      topFactor: {
        number: topFactorNumber,
        name: factorNames[topFactorNumber],
        score: parseFloat(topFactorEntry[1].toString()),
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
    1: '/images/smart-speaker.png',
    2: '/images/wired-earbuds.png',
    3: '/images/jukebox.png',
    4: '/images/noise-cancelling-headphones.png',
    5: '/images/studio-headphones.png',
    6: '/images/airpods.png',
    7: '/images/vinyl-crate.png',
    8: '/images/boombox.png',
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (isStraightlined)
    return <div className="boring">Your listener profile is ... boring. Please try again!</div>;
  if (!results) return <div>No results to display</div>;

  return (
    <div className="results-page">
      <div ref={shareableRef} className="results-layout">
        <div className="radar-section">
          <RadarChart factorScores={results.factorScores} factorNames={factorNames} />
        </div>
        <div className="results-info">
          <h1>Your Music Listening Profile</h1>
          <h2>You are: {results.topFactor.name}</h2>
          <p className="score">Score: {(results.topFactor.score * 100).toFixed(1)}%</p>
          <p>{results.topFactor.description}</p>
          <img src={factorImages[results.topFactor.number]} alt={results.topFactor.name} />
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