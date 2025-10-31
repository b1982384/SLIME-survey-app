import React, { useState, useEffect, useRef } from 'react';
import cornerBanner from './assets/corner_banner.png';
import { Download } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import './result.css';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  PinterestShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  RedditIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
  PinterestIcon,
  EmailIcon,
} from 'react-share';

type FactorScores = Record<number, number>;
type FactorNames = Record<number, string>;
type FactorImages = Record<number, string>;
type RealFactorNames = Record<number, string>;

type FrequencyBin = {
  center: number;
  count: number;
};

interface FactorFrequencyChartProps {
  data: FrequencyBin[];
  factorLabel: string;
  userScore?: number;
}

const FAKE_FACTOR_FREQUENCIES = [
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
  const gradientId = `grad-${factorLabel.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

  return (
    <div style={{ width: 320, height: 180, margin: "1rem auto" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.90}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="center"
            type="number"
            domain={[0, 1]}
            ticks={[0.25, 0.5, 0.75, 1.0]}
            tickFormatter={(v) => `${Math.round(v * 100)}%`}
          />
          <YAxis hide domain={[0, 'dataMax']} />
          <Tooltip
            formatter={(value, name) => [value, name === "count" ? "Respondents" : name]}
            labelFormatter={(v) => `${Math.round(v * 100)}%`}
          />

          <Area
            type="monotone"
            dataKey="count"
            stroke="none"
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
            isAnimationActive={false}
          />

          {typeof userScore === "number" && (
            <ReferenceLine x={userScore} stroke="#ef4444" strokeWidth={2} label="You" />
          )}
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ textAlign: "center", fontWeight: "bold" }}>{factorLabel}</div>
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

interface AngleLabelProps {
  cx?: number;
  cy?: number;
  radius?: number;
  outerRadius?: number;
  payload?: any;
}

interface AngleLabelProps {
  cx?: number;
  cy?: number;
  radius?: number;
  outerRadius?: number;
  payload?: any;
}

// Type for radar data
interface RadarData {
  factor: string;
  score: number;
}

const wrapText = (text: string, maxChars: number) => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + " " + word).trim().length <= maxChars) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) lines.push(currentLine);

  return lines;
};

const AngleLabel = (props: any) => {
  const { cx, cy, payload, radius, outerRadius } = props;
  const centerX = cx ?? 0;
  const centerY = cy ?? 0;
  const r = radius || outerRadius || 100;
  const OFFSET = r * 0.35;
  const fontSize = Math.max(r * 0.08, 12);

  const angleRad = (payload?.coordinate ?? 0) * (Math.PI / 180);
  const tx = centerX + (r + OFFSET) * Math.cos(-angleRad);
  const ty = centerY + (r + OFFSET) * Math.sin(-angleRad);

  // Flip bottom-half labels upright
  const angleDeg = payload?.coordinate ?? 0;
  const rotation = angleDeg > 90 && angleDeg < 270 ? 180 : 0;

  // Wrap the label text
  const lines = wrapText(payload?.value ?? "", 10); // 10 chars per line

  return (
    <text
      x={tx}
      y={ty}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={fontSize}
      fontWeight={600}
      fill="#111827"
      transform={`rotate(${rotation}, ${tx}, ${ty})`}
    >
      {lines.map((line, index) => (
        <tspan key={index} x={tx} dy={index === 0 ? 0 : fontSize * 1.5}>
          {line}
        </tspan>
      ))}
    </text>
  );
};


const ResultsPage = () => {
  const shareableRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const readStoredResponses = (): number[] | null => {
    try {
      const raw = localStorage.getItem('surveyResponses');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const initialResponses = location.state?.responses ?? readStoredResponses() ?? null;
  const [responses, setResponses] = useState<number[] | null>(initialResponses);

  const [mounted, setMounted] = useState(false);

  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStraightlined, setIsStraightlined] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (location.state?.responses) {
      try {
        localStorage.setItem('surveyResponses', JSON.stringify(location.state.responses));
      } catch {
        // ignore
      }
    }
    if (!responses && location.state?.responses) {
      setResponses(location.state.responses);
    }
  }, []);

  useEffect(() => {
    if (!responses) {
      setLoading(false);
      return;
    }

    const fivePointIndices = new Set([15, 16, 17, 18, 19, 20, 21, 22, 23]);
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

  useEffect(() => {
    if (!loading && !responses) {
      navigate('/', { replace: true });
    }
  }, [loading, responses, navigate]);

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

  const negativelyWeighted = new Set([12]);

  const realfactorNames: RealFactorNames = {
    1: "Platform Trust",
    2: "Platform Control",
    3: "Playlist Creator",
    4: "Independent Listener",
    5: "Deep Listener",
    6: "Discovery Engaged",
    7: "Explorer",
    8: "Physical & Emotional",
  };

  const factorNames: FactorNames = {
    1: "Smart Speaker",
    2: "Wired Earbuds",
    3: "Jukebox",
    4: "Noise-Cancelling Headphones",
    5: "Studio Headphones",
    6: "AirPods",
    7: "Vinyl Crate",
    8: "Boombox",
  };

  const factorDescriptions: FactorNames = {
    1: "You’re a Smart Speaker – curious, open, and tuned in to what’s up next. Listeners like you have a high degree of musical openness and trust the process of discovery, whether it comes from a recommendation algorithm or a friend’s playlist. Your listening habits reflect a want to expand one’s musical palette and comfort with serendipity, new sounds that still fit your taste.",
    2: "You’re Wired Earbuds – direct, deliberate, and happily analog in spirit. Listeners like you prefer to stay in control of what’s in the queue and value intentional listening over endless recommendations. For you, music is a space of agency, knowing what you want to play and when.",
    3: "You’re a Jukebox –  a personal archive of sound and sentiment where every track has a time, place, and emotion attached. Listeners like you are deeply aware of how music maps onto mood, and you take pride in knowing exactly which song fits the moment.",
    4: "You’re Noise-Cancelling Headphones — focused, discerning, and immune to the noise of trends. Listeners like you listen privately and intentionally, finding meaning in the music you choose rather than what’s surfaced for you. In other words, you strive for resonance over popularity.",
    5: "You’re Studio Headphones — patient, analytical, and deeply engaged. Listeners like you are deeply engaged, not just hearing music, but truly listening to it. You likely take pleasure in the craft, structure, and texture of sound. Listeners like you tend to listen by full albums and use recommendations as starting point for exploration.",
    6: "You’re AirPods — music plays an integral role in your everyday rhythm. Listeners like you are open to discovery, enjoy music as a social experience, and curious to find the next up and coming thing.",
    7: "You’re a Vinyl Crate — the archetype of exploration. Listeners like you score high on discovery, flipping through the unfamiliar in search of something special, and often appreciate music as an act of curation, the process of finding meaning in what others might overlook.",
    8: "You’re a Boombox — expressive, communal, and full of presence. For listeners like you, music is both a cultural relic and a way to connect. Listening is a shared experience – you curate the vibe, set the tone, and bring people together through sound. As a Boombox, you’re more likely to collect physical media like vinyl, and odds are, you’re the one on aux.",
  };

  const calculateFactorScoresForResponse = (responsesArr: number[]): FactorScores => {
    const factorScores: FactorScores = {};
    const factorQuestionCounts: Record<number, number> = {};

    for (let i = 1; i <= 8; i++) {
      factorScores[i] = 0;
      factorQuestionCounts[i] = 0;
    }

    for (let i = 0; i < responsesArr.length; i++) {
      if (responsesArr[i] === null) continue;

      const factor = questionToFactor[i];
      if (!factor) continue;

      let normalizedScore: number;
      const responseValue = responsesArr[i];

      const fivePointIndices = new Set([15, 16, 17, 18, 19, 20, 21, 22, 23]);

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

  const calculateFactorScores = (responsesArr: number[]): Results => {
    const factorScores = calculateFactorScoresForResponse(responsesArr);

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
  
    const h1 = shareableRef.current.querySelector('.results-info h1');
    if (!h1) return;
  
    let tempCanvas;
  
    try {
      const text = h1.textContent.trim().toUpperCase();
      const style = getComputedStyle(h1);
      const fontFamily = "'Archivo Black', sans-serif";
      const fontWeight = style.fontWeight || "bold";
      const baseFontSize = parseFloat(style.fontSize);
      const fontSize = baseFontSize * 1.1; // slightly bigger
  
      const h1Rect = h1.getBoundingClientRect();
      const maxTextWidth = h1Rect.width;
  
      // Wrap text
      const measureCanvas = document.createElement("canvas");
      const measureCtx = measureCanvas.getContext("2d");
      measureCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  
      const words = text.split(" ");
      let lines = [];
      let line = "";
  
      for (let n = 0; n < words.length; n++) {
        const testLine = line ? line + " " + words[n] : words[n];
        if (measureCtx.measureText(testLine).width > maxTextWidth && line) {
          lines.push(line);
          line = words[n];
        } else {
          line = testLine;
        }
      }
      lines.push(line);
  
      const lineHeight = fontSize;
      const paddingTop = 8; // small gap at top and bottom
      const canvasHeight = lines.length * lineHeight + paddingTop;
  
      // Create temporary canvas
      tempCanvas = document.createElement("canvas");
      tempCanvas.width = h1Rect.width;
      tempCanvas.height = canvasHeight;
  
      const ctx = tempCanvas.getContext("2d");
  
      // Gradient fill
      const gradient = ctx.createLinearGradient(0, 0, tempCanvas.width, 0);
      gradient.addColorStop(0, "#A069E8");
      gradient.addColorStop(1, "#47A6E0");
      ctx.fillStyle = gradient;
  
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
  
      // Draw each line with small top padding
      lines.forEach((ln, i) => {
        ctx.fillText(ln, tempCanvas.width / 2, paddingTop + i * lineHeight);
      });
  
      // Position canvas absolutely over original h1
      const parent = h1.parentNode;
      tempCanvas.style.position = "absolute";
      tempCanvas.style.left = `${h1.offsetLeft}px`;
      tempCanvas.style.top = `${h1.offsetTop}px`;
      tempCanvas.style.zIndex = "1000";
  
      h1.style.visibility = "hidden";
      parent.appendChild(tempCanvas);
  
      // Capture screenshot
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(shareableRef.current, {
        backgroundColor: null,
        scale: 2,
      });
  
      // Download
      const link = document.createElement("a");
      link.download = "my-music-profile.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error(error);
      alert("Unable to generate image.");
    } finally {
      // Cleanup
      if (tempCanvas) tempCanvas.remove();
      if (h1) h1.style.visibility = "visible";
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

  if (isStraightlined) {
    return <div className="boring">Your listener profile is ... boring. Please try again!</div>;
  }

  if (!results) return <div>No results to display</div>;

  const radarData = Object.keys(results.factorScores).map(key => ({
    factor: realfactorNames[parseInt(key)],
    score: results.factorScores[parseInt(key)] * 100,
    fullMark: 100
  }));

  // share values used by all share buttons
  const shareUrl = 'https://slime-survey-app-9smf-7u05z3uox-bwfs-projects.vercel.app';
  const shareTitle = `I am a ${results.topFactor.name}! What are you?`;

  const pinterestImage = `${shareUrl}/preview-image.png`;

  return (
    <div className="results-page">
      <div className="corner-banners">
      <img src={cornerBanner} alt="Top Banner" className="corner-banner top-left" />
      <img src={cornerBanner} alt="Bottom Banner" className="corner-banner bottom-right" />
      </div>

      <div ref={shareableRef} className="results-layout">
      <div className="results-info">
          <h1>Your Music Listening Profile</h1>
          <img
            src={factorImages[results.topFactor.number]}
            alt={results.topFactor.name}
          />
          <h4>Illustration by Katie Lam</h4>
          <h2>You are a {results.topFactor.name}!</h2>
           <h3 className="score">
                Score: {(results.topFactor.score * 100).toFixed(1)}%
              </h3>
          <p>{results.topFactor.description}</p>  
          <h2>Radar Chart</h2>        
          <div className="radar-section">
          <ResponsiveContainer width="100%" height={Math.min(window.innerWidth * 0.8, 400)}>
            <RadarChart data={radarData} outerRadius="80%" margin={{ top: 40, right: 40, bottom: 40, left: 40 }} >
              <PolarGrid stroke="#d1d5db" strokeWidth={1} />
              <PolarAngleAxis
                dataKey="factor"
                tick={<AngleLabel />}
                tickLine={false}
              />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
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
        </div>
      </div>
      <h1>Factor Distributions</h1>
      <div className="factor-frequency-charts" style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
        {mounted && Object.entries(realfactorNames).map(([key, name], idx) => (
          <FactorFrequencyChart
            key={key}
            data={FAKE_FACTOR_FREQUENCIES[idx]}
            factorLabel={name}
            userScore={results?.factorScores[Number(key)]}
          />
        ))}
      </div>

      <div>
        <h3>Description of Results</h3>
        <p>1.	Platform Trust - Values discovery through algorithms or others’ suggestions. Open-minded, curious, and comfortable letting recommendations guide their next listen. </p>
        <p>2.	Platform Control - Prefers intentional listening and personal curation. Chooses what to play with purpose and enjoys full control over their music experience.</p>
        <p>3.	Playlist Creator - Treats music as a diary of moments and moods. Each song carries personal meaning, and curation reflects emotional awareness and memory.</p>
        <p>4.	Independent Listener - Listens privately and with discernment. Focuses on depth and authenticity in music rather than trends or external influence.</p>
        <p>5.	Deep Listener - Immersed in the details of sound. Appreciates structure, production, and full albums, approaching music with patience and analytical curiosity.</p>
        <p>6.	Discovery Engaged - Integrates music naturally into daily life. Enjoys finding new artists, sharing songs socially, and staying tuned to emerging trends.</p>
        <p>7.	Explorer - Seeks out the unfamiliar. Finds joy in uncovering hidden gems and building meaning through exploration and diverse listening.</p>
        <p>8.	Physical & Emotional - Listens communally and expressively. Uses music to create connection and atmosphere, often valuing tangible formats and shared experiences.</p>
      </div>

      <div className="share-section">
        <p>Share your results! Use the button below to download, take a screenshot, or share to socials.</p>
        <button className="download-btn" onClick={handleDownloadImage}>
          <Download size={20} /> Download Results
        </button>

        <div className="social-row" style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <FacebookShareButton url={shareUrl} title={shareTitle} hashtag="#MusicListeningProfile">
            <FacebookIcon size={36} round />
          </FacebookShareButton>

          <TwitterShareButton url={shareUrl} title={shareTitle} hashtags={["MusicListeningProfile","MusicPersonality"]}>
            <TwitterIcon size={36} round />
          </TwitterShareButton>

          <RedditShareButton url={shareUrl} title={shareTitle}>
            <RedditIcon size={36} round />
          </RedditShareButton>

          <LinkedinShareButton url={shareUrl} title={shareTitle}>
            <LinkedinIcon size={36} round />
          </LinkedinShareButton>

          <WhatsappShareButton url={shareUrl} title={shareTitle}>
            <WhatsappIcon size={36} round />
          </WhatsappShareButton>

          <TelegramShareButton url={shareUrl} title={shareTitle}>
            <TelegramIcon size={36} round />
          </TelegramShareButton>

          <PinterestShareButton url={shareUrl} media={pinterestImage} description={shareTitle}>
            <PinterestIcon size={36} round />
          </PinterestShareButton>

          <EmailShareButton url={shareUrl} subject="Check out my Music Listening Profile!" body={`${shareTitle}\n\n${shareUrl}`}>
            <EmailIcon size={36} round />
          </EmailShareButton>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;