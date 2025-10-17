import React, { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import './result.css';
// ---- FREQUENCY LINE CHART COMPONENT ----
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer , ReferenceLine} from 'recharts';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  ThreadsShareButton
} from 'react-share';


type FactorScores = Record<number, number>;
type FactorNames = Record<number, string>;
type FactorImages = Record<number, string>;

type FrequencyBin = {
  center: number;
  count: number;
};

interface FactorFrequencyChartProps {
  data: FrequencyBin[];
  factorLabel: string;
  userScore?: number;
}

// testing fake data
// ---- FAKE BINNED DATA FOR 8 FACTORS ----
const FAKE_FACTOR_FREQUENCIES = [
  // Each array below: 10 bins, x=center (0.05, 0.15, ...), count=fake frequency
  [
    { center: 0.05, count: 1 }, { center: 0.15, count: 2 }, { center: 0.25, count: 5 },
    { center: 0.35, count: 10 }, { center: 0.45, count: 15 }, { center: 0.55, count: 18 },
    { center: 0.65, count: 12 }, { center: 0.75, count: 9 }, { center: 0.85, count: 4 }, { center: 0.95, count: 1 }
  ],
  [
    { center: 0.05, count: 0 }, { center: 0.15, count: 3 }, { center: 0.25, count: 7 },
    { center: 0.35, count: 12 }, { center: 0.45, count: 14 }, { center: 0.55, count: 11 },
    { center: 0.65, count: 13 }, { center: 0.75, count: 6 }, { center: 0.85, count: 2 }, { center: 0.95, count: 0 }
  ],
  // ...repeat for all 8 factors, or just copy and modify the above for demo!
  [
    { center: 0.05, count: 2 }, { center: 0.15, count: 6 }, { center: 0.25, count: 12 },
    { center: 0.35, count: 17 }, { center: 0.45, count: 15 }, { center: 0.55, count: 10 },
    { center: 0.65, count: 8 }, { center: 0.75, count: 7 }, { center: 0.85, count: 3 }, { center: 0.95, count: 1 }
  ],
  [
    { center: 0.05, count: 4 }, { center: 0.15, count: 5 }, { center: 0.25, count: 8 },
    { center: 0.35, count: 11 }, { center: 0.45, count: 13 }, { center: 0.55, count: 14 },
    { center: 0.65, count: 13 }, { center: 0.75, count: 8 }, { center: 0.85, count: 4 }, { center: 0.95, count: 2 }
  ],
  [
    { center: 0.05, count: 0 }, { center: 0.15, count: 1 }, { center: 0.25, count: 7 },
    { center: 0.35, count: 13 }, { center: 0.45, count: 14 }, { center: 0.55, count: 16 },
    { center: 0.65, count: 12 }, { center: 0.75, count: 9 }, { center: 0.85, count: 3 }, { center: 0.95, count: 0 }
  ],
  [
    { center: 0.05, count: 3 }, { center: 0.15, count: 4 }, { center: 0.25, count: 10 },
    { center: 0.35, count: 16 }, { center: 0.45, count: 15 }, { center: 0.55, count: 12 },
    { center: 0.65, count: 11 }, { center: 0.75, count: 8 }, { center: 0.85, count: 4 }, { center: 0.95, count: 1 }
  ],
  [
    { center: 0.05, count: 2 }, { center: 0.15, count: 3 }, { center: 0.25, count: 8 },
    { center: 0.35, count: 14 }, { center: 0.45, count: 17 }, { center: 0.55, count: 15 },
    { center: 0.65, count: 10 }, { center: 0.75, count: 7 }, { center: 0.85, count: 3 }, { center: 0.95, count: 1 }
  ],
  [
    { center: 0.05, count: 1 }, { center: 0.15, count: 2 }, { center: 0.25, count: 6 },
    { center: 0.35, count: 13 }, { center: 0.45, count: 15 }, { center: 0.55, count: 17 },
    { center: 0.65, count: 14 }, { center: 0.75, count: 8 }, { center: 0.85, count: 3 }, { center: 0.95, count: 0 }
  ]
];



const FactorFrequencyChart: React.FC<FactorFrequencyChartProps> = ({ data, factorLabel, userScore }) => {
  // userScore: optional, value between 0 and 1
  // Find the closest x for the userScore for vertical line
  return (
    <div style={{ width: 320, height: 180, margin: "1rem auto" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="center"
            type="number"
            domain={[0,1]}
            ticks={[0,0.2,0.4,0.6,0.8,1.0]}
            tickFormatter={v => `${Math.round(v*100)}%`}
          />
          <YAxis allowDecimals={false} />
          <Tooltip 
            formatter={(value, name) => [value, name === "count" ? "Respondents" : name]}
            labelFormatter={v => `${Math.round(v*100)}%`}
          />
          <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{r: 3}} />
          {/* userScore vertical line */}
          {typeof userScore === "number" && 
            (<ReferenceLine x={userScore} stroke="#ef4444" strokeWidth={2} label="You" />

            )}
        </LineChart>
      </ResponsiveContainer>
      <div style={{textAlign: "center", fontWeight: "bold"}}>{factorLabel}</div>
    </div>
  );
};


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
  
  const factorNames: FactorNames = { // THIS IS NOW UPDATED -
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
    1: "You are a Smart Speaker! You’re always ready to hear what’s next, you have a high degree of musical openness, and you generally trust the algorithmic process to fresh discoveries that still align with your personal tastes.",
    2: "You’re Wired Earbuds — simple, direct, and in full control. No autoplay, no surprises: just the music you choose, the way you want it.",
    3: "You’re a Jukebox! You are overflowing with songs, playlists, and hidden gems. Each track is catalogued into your personal archive, and you’re always ready to play the perfect one on demand. You score high on emotional alignment, meaning you like to pick just the right tune for how you’re feeling at any given moment.",
    4: "You are Noise-Cancelling Headphones. You tune out the noise of popularity and platforms. Your listening is private, intentional, and completely yours.",
    5: "You are Studio Headphones. Like Studio Headphones, your listening is tuned for clarity and depth. You listen closely, savor full albums, and treat music like a rich, immersive world.",
    6: "You are AirPods. Your music is woven into your daily life, and you love to dig deeper into new things. You score high on the omnivore score, meaning you have insatiable musical appetite and probably love to listen to music socially.",
    7: "You are a Vinyl Crate, always digging for the next discovery. You love flipping through the unfamiliar and novel, hunting for gems others might overlook.",
    8: "You are a Boombox. Bold and sociable, you’re the Boombox. Music isn’t just for you — it’s a vibe you broadcast, connecting people and setting the mood.",
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
      const html2canvas = (await import("html2canvas")).default;
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
          <p className="tiny-text">Illustrations by Katie Lam</p>
        </div>
      </div>

        {/* ---- FREQUENCY PLOTS ---- */}
        <div className="factor-frequency-charts" style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
          {Object.entries(factorNames).map(([key, name], idx) => (
            <FactorFrequencyChart
              key={key}
              data={FAKE_FACTOR_FREQUENCIES[idx]}
              factorLabel={name}
              // Example: overlay this user's score on each chart
              userScore={results?.factorScores[Number(key)]}
            />
          ))}
        </div>
        <div className="share-section">
        <p>Share your results! Use the button below to download, or take a screenshot.</p>
        <button className="download-btn" onClick={handleDownloadImage}>
          <Download size={20} /> Download Results
        </button>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'center' }}>
          <FacebookShareButton 
            url="https://slime-survey-app-9smf-7u05z3uox-bwfs-projects.vercel.app"
            hashtag="#MusicListeningProfile"
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
    
          <TwitterShareButton 
            url="https://slime-survey-app-9smf-7u05z3uox-bwfs-projects.vercel.app"
            title={`I am a ${results.topFactor.name}! What are you?`}
            hashtags={["MusicListeningProfile", "MusicPersonality"]}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>

          <ThreadsShareButton
            url="https://slime-survey-app-9smf-7u05z3uox-bwfs-projects.vercel.app"
            title={`I am a ${results.topFactor.name}! What are you?`}
            hashtags={["MusicListeningProfile", "MusicPersonality"]}
          >
            <TwitterIcon size={32} round />
          </ThreadsShareButton>
        </div>
      </div>
      </div>
  );
};

export default ResultsPage;