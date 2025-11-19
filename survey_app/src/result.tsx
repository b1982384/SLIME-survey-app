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
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

import type { TooltipContentProps } from 'recharts';

import './result.css';

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

const QUESTION_TO_FACTOR: Record<number, number> = {
  5: 1, 10: 1, 1: 1,
  13: 2, 9: 2, 6: 2,
  22: 3, 21: 3, 15: 3,
  8: 4, 11: 4, 2: 4,
  19: 5, 4: 5, 12: 5,
  3: 6, 18: 6, 23: 6,
  16: 7, 0: 7, 7: 7,
  20: 8, 17: 8, 14: 8,
};

const NEGATIVELY_WEIGHTED = new Set([12]);

// const REAL_FACTOR_NAMES: RealFactorNames = {
//   1: "Platform Trust",
//   2: "Platform Control",
//   3: "Playlist Creator",
//   4: "Independent Listener",
//   5: "Deep Listener",
//   6: "Discovery Engaged",
//   7: "Explorer",
//   8: "Physical & Emotional",
// };

const REAL_FACTOR_NAMES: RealFactorNames = {
  1: "Lean-Back Listening",
  2: "Skeptical of Algorithms",
  3: "Emotional Alignment",
  4: "Individuality",// & Non-Conformity",
  5: "Deep Listening",
  6: "Musical Omnivorism",
  7: "Exploration",
  8: "Curation",
};


const FACTOR_NAMES: FactorNames = {
  1: "Smart Speaker",
  2: "Wired Earbuds",
  3: "Jukebox",
  4: "Noise-Cancelling Headphones",
  5: "Studio Headphones",
  6: "AirPods",
  7: "Vinyl Crate",
  8: "Boombox",
};

const FACTOR_DESCRIPTIONS: FactorNames = {
  1: "You’re a Smart Speaker – curious, open, and tuned in to what’s up next. Listeners like you have a high degree of musical openness and trust the process of discovery, whether it comes from a recommendation algorithm or a friend’s playlist. Your listening habits reflect a want to expand one’s musical palette and comfort with serendipity, new sounds that still fit your taste.",
  2: "You’re Wired Earbuds – direct, deliberate, and happily analog in spirit. Listeners like you prefer to stay in control of what’s in the queue and value intentional listening over endless recommendations. For you, music is a space of agency, knowing what you want to play and when.",
  3: "You’re a Jukebox –  a personal archive of sound and sentiment where every track has a time, place, and emotion attached. Listeners like you are deeply aware of how music maps onto mood, and you take pride in knowing exactly which song fits the moment.",
  4: "You’re Noise-Cancelling Headphones — focused, discerning, and immune to the noise of trends. Listeners like you listen privately and intentionally, finding meaning in the music you choose rather than what’s surfaced for you. In other words, you strive for resonance over popularity.",
  5: "You’re Studio Headphones — patient, analytical, and deeply engaged. Listeners like you are deeply engaged, not just hearing music, but truly listening to it. You likely take pleasure in the craft, structure, and texture of sound. Listeners like you tend to listen by full albums and use recommendations as starting point for exploration.",
  6: "You’re AirPods — music plays an integral role in your everyday rhythm. Listeners like you are open to discovery, enjoy music as a social experience, and curious to find the next up and coming thing.",
  7: "You’re a Vinyl Crate — the archetype of exploration. Listeners like you score high on discovery, flipping through the unfamiliar in search of something special, and often appreciate music as an act of curation, the process of finding meaning in what others might overlook.",
  8: "You’re a Boombox — expressive, communal, and full of presence. For listeners like you, music is both a cultural relic and a way to connect. Listening is a shared experience – you curate the vibe, set the tone, and bring people together through sound. As a Boombox, you’re more likely to collect physical media like vinyl, and odds are, you’re the one on aux.",
};

const FrequencyTooltip: React.FC<TooltipContentProps<number, string>> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const entry = payload.find((item) => typeof item.value === 'number');
  if (!entry || typeof entry.value !== 'number' || typeof label !== 'number') {
    return null;
  }

  return (
    <div className="factor-tooltip">
      <div className="factor-tooltip__label">{`${Math.round(label * 100)}%`}</div>
      <div className="factor-tooltip__value">{`${entry.value} Respondents`}</div>
    </div>
  );
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

    const factor = QUESTION_TO_FACTOR[i];
    if (!factor) continue;

    let normalizedScore: number;
    const responseValue = responsesArr[i];

    const fivePointIndices = new Set([15, 16, 17, 18, 19, 20, 21, 22, 23]);

    if (fivePointIndices.has(i)) {
      normalizedScore = (responseValue - 1) / 4;
    } else {
      normalizedScore = (responseValue - 1) / 6;
    }

    if (NEGATIVELY_WEIGHTED.has(i)) {
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
      name: FACTOR_NAMES[topFactorNumber],
      score: factorScores[topFactorNumber],
      description: FACTOR_DESCRIPTIONS[topFactorNumber],
    },
  };
};

const FactorFrequencyChart: React.FC<FactorFrequencyChartProps> = ({ data, factorLabel, userScore }) => {
  const gradientId = `grad-${factorLabel.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

  return (
    <div style={{ width: 320, height: 180, margin: "1rem auto" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.90} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7} />
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
          <Tooltip<number, string> content={(props) => <FrequencyTooltip {...props} />} />

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

interface AngleLabelProps {
  cx?: number;
  cy?: number;
  payload?: {
    coordinate?: number;
    value?: string;
  };
  radius?: number;
  outerRadius?: number;
}

const AngleLabel = (props: AngleLabelProps) => {
  const { cx, cy, payload, radius, outerRadius } = props;
  const centerX = cx ?? 0;
  const centerY = cy ?? 0;
  const r = radius || outerRadius || 100;
  const OFFSET = Math.min(r * 0.25, 45);
  const isMobile = window.innerWidth < 600;
  const fontSize = isMobile
    ? Math.max(Math.min(r * 0.06, 14), 10)
    : Math.max(Math.min(r * 0.1, 18), 12);

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
        <tspan key={index} x={tx} dy={index === 0 ? 0 : fontSize * 1.2}>
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
  const [isDownloadMode, setIsDownloadMode] = useState(false);

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
  }, [location.state.responses, responses]);

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

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleDownloadImage = async () => {
    if (!shareableRef.current) return;

    const h1 = shareableRef.current.querySelector('.results-info h1');
    if (!h1) return;

    let tempCanvas: HTMLCanvasElement | null = null;

    try {
      setIsDownloadMode(true);
      await delay(50);
      const text = h1.textContent ? h1.textContent.trim().toUpperCase() : '';
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
      if (measureCtx) {
        measureCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      } else {
        throw new Error("Unable to get 2D context for measure canvas.");
      }

      const words = text.split(" ");
      const lines = [];
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
      if (!ctx) {
        console.error("Unable to get 2D context for temporary canvas.");
        return;
      }

      const gradient = ctx.createLinearGradient(0, 0, tempCanvas.width, 0);
      gradient.addColorStop(0, "#A069E8");
      gradient.addColorStop(1, "#47A6E0");
      ctx.fillStyle = gradient;

      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      // Draw each line with small top padding
      lines.forEach((ln, i) => {
        if (tempCanvas) {
          ctx.fillText(ln, tempCanvas.width / 2, paddingTop + i * lineHeight);
        }
      });

      // Position canvas absolutely over original h1
      const parent = h1.parentNode;
      tempCanvas.style.position = "absolute";
      tempCanvas.style.left = `${(h1 as HTMLElement).offsetLeft}px`;
      tempCanvas.style.top = `${(h1 as HTMLElement).offsetTop}px`;
      tempCanvas.style.zIndex = "1000";

      (h1 as HTMLElement).style.visibility = "hidden";
      if (parent) {
        parent.appendChild(tempCanvas);
      }

      // Capture screenshot
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(shareableRef.current, {
        backgroundColor: "#0f1f27",
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
      if (tempCanvas && tempCanvas instanceof HTMLCanvasElement) tempCanvas.remove();
      if (h1 && h1 instanceof HTMLElement) h1.style.visibility = "visible";
      setIsDownloadMode(false);
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
    factor: REAL_FACTOR_NAMES[parseInt(key)],
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

      <div
        ref={shareableRef}
        className={`results-layout${isDownloadMode ? ' download-mode' : ''}`}
      >
        <div className="results-info">
          <h1>Your Music Listening Profile</h1>
          <img
            src={factorImages[results.topFactor.number]}
            alt={results.topFactor.name}
          />
          <h4>Illustration by Katie Lam</h4>
          <h2>You are a...</h2>
          <h1>{results.topFactor.name}</h1>
          {/* <h3 className="score">
            Score: {(results.topFactor.score * 100).toFixed(1)}%
          </h3> */}
          <p>{results.topFactor.description}</p>
          <h2>Your Listening Traits</h2>
          <div className="radar-section">
            <div className="radar-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="72%" margin={{ top: 24, right: 24, bottom: 24, left: 24 }} >
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
      </div>

      <section className="results-section">
        <h1>Trait Distributions</h1>
        <div className="factor-frequency-charts">
          {mounted && Object.entries(REAL_FACTOR_NAMES).map(([key, name], idx) => (
            <FactorFrequencyChart
              key={key}
              data={FAKE_FACTOR_FREQUENCIES[idx]}
              factorLabel={name}
              userScore={results?.factorScores[Number(key)]}
            />
          ))}
        </div>
      </section>

      <section className="results-section">
        <h1>About Each Trait</h1>
        <p>1. Lean-Back Listening: This factor indicates an openness to exploring music through recommendation and expanding one’s musical pallette. There is a high degree of algorithmic trust.</p>
        <p>2. Skeptical of Algorithms: This factor demonstrates a low-degree of algorithmic trust, and a high degree for control. Scoring high on this factor usually means that people feel uneasy about letting recommendation algorithms decide one’s listening habits.</p>
        <p>3. Emotional Alignment: This factor demonstrates an alignment of music with an emotional state, and also a general awareness of how algorithmic recommendation works. Scoring high in this factor generally means that one has a personal relationship with the music they listen to.</p>
        <p>4. Individuality: Scoring high in this factor indicates a preference for personal alignment over popular opinion or mainstream trends. Individuals high in individuality tend to trust algorithms less and show little interest in recommendations from either friends or automated systems.</p>
        <p>5. Deep Listening - Immersed in the details of sound. Appreciates structure, production, and full albums, approaching music with patience and analytical curiosity.</p>
        <p>6. Musical Omnivorism: Participants scoring high in this measure are very open to new music, listen to music socially, and love to dig deeper into new arts, bands, as well as what’s trending.</p>
        <p>7. Exploration: People scoring high in this measure like to explore everything, and will frequently listen to music that they haven’t heard before.</p>
        <p>8. Curation: Scoring high in this measure means that you connect deeply to music on an emotional level, and you view music very socially. People scoring high in this tend to collect physical music, make playlists and mixes for their friends and family, and connect music to emotion.</p>
      </section>

      <section className="results-section share-section">
        <p>Share your results! Use the button below to download, take a screenshot, or share to socials.</p>
        <button className="download-btn" onClick={handleDownloadImage}>
          <Download size={20} /> Download Results
        </button>

        <div className="social-row" style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <FacebookShareButton url={shareUrl} title={shareTitle} hashtag="#MusicListeningProfile">
            <FacebookIcon size={36} round />
          </FacebookShareButton>

          <TwitterShareButton url={shareUrl} title={shareTitle} hashtags={["MusicListeningProfile", "MusicPersonality"]}>
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
      </section>
    </div>
  );
};

export default ResultsPage;
