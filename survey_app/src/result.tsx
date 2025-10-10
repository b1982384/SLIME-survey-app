import React, { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
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
  percentiles: Record<number, number>;
};

type DistributionData = {
  factor: number;
  bins: { range: string; count: number; highlight?: boolean }[];
};

const ResultsPage = () => {
  const shareableRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Get responses from navigation state, fallback to test data if not available
  const responses = location.state?.responses || Array.from({ length: 24 }, () => Math.floor(Math.random() * 5) + 2);
  
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStraightlined, setIsStraightlined] = useState(false);
  const [distributions, setDistributions] = useState<DistributionData[]>([]);

  // Correct mapping based on your factor definitions
  // Questions are 0-indexed, so subtract 1 from question numbers
  const questionToFactor: Record<number, number> = {
    // Factor 1: Platform trust & influence (7-point questions)
    5: 1,  // "I can rely on my music platform's recommendations..."
    10: 1, // "I enjoy the music my music platform plays when it takes over..."
    1: 1,  // "I feel like I play a strong role in how things are recommended to me"
    
    // Factor 2: Platform control avoidance (7-point questions)
    13: 2, // "I feel uneasy letting the platform decide what to play next"
    9: 2,  // "I prefer to skip songs the platform adds or suggests automatically"
    6: 2,  // "I avoid app-curated playlists and mixes – I prefer my own"
    
    // Factor 3: Playlist creation (5-point questions, indices 15-23)
    22: 3, // "How often do you add to or edit your existing playlists?"
    21: 3, // "How often do you make playlists for yourself?"
    15: 3, // "How often do you make and create playlists on your music platform?"
    
    // Factor 4: Independence & skepticism (7-point questions)
    8: 4,  // "I think that artists make better music when they aren't really popular"
    11: 4, // "I don't like the music my friends listen to"
    2: 4,  // "I worry that my music platform recommends music for its own interests not mine"
    
    // Factor 5: Music approach & reflection (mixed)
    19: 5, // "How often do you listen to music via full albums?" (5-point)
    4: 5,  // "I think that popular artists are popular because they make better music" (7-point)
    12: 5, // "I choose music without considering how I'm feeling" (7-point)
    
    // Factor 6: Discovery engagement (mixed)
    3: 6,  // "I keep up with popular/trending songs" (7-point)
    18: 6, // "When you hear a new song... how often do you look up the artist..." (5-point)
    23: 6, // "When you hear a new song... how often do you save or like it..." (5-point)
    
    // Factor 7: Exploration (mixed)
    16: 7, // "How often do you listen to unfamiliar music?" (5-point)
    0: 7,  // "I like to explore songs from all genres" (7-point)
    7: 7,  // "I frequently listen to music by artists I haven't heard before" (7-point)
    
    // Factor 8: Physical connection & emotion (mixed)
    20: 8, // "How often do you collect physical music formats?" (5-point)
    17: 8, // "How often do you make playlists for friends?" (5-point)
    14: 8, // "I use music to better understand or make sense of my emotions" (7-point)
  };

  // Questions that should be reverse-scored
  const negativelyWeighted = new Set([12]); // "I choose music without considering how I'm feeling" should be reversed
  
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
    fetchDistributions();
    
    // Check for straightlining (all neutral responses)
    const isNeutral = responses.every((response: number, index: number) => {
      if (response === null) return false;
      
      if (fivePointIndices.has(index)) {
        // For 5-point scale: neutral is 3 (middle value)
        return response === 3;
      } else {
        // For 7-point scale: neutral is 4 (middle value)
        return response === 4;
      }
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

  const fetchDistributions = async () => {
    try {
      // Fetch all responses from database
      const { data, error } = await supabase
        .from('responses')
        .select('*');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Calculate distributions for each factor
        const factorDistributions = calculateDistributions(data);
        setDistributions(factorDistributions);
      }
    } catch (error) {
      console.error('Error fetching distributions:', error);
    }
  };

  const calculateDistributions = (allResponses: { [key: string]: number | null }[]): DistributionData[] => {
    const distributions: DistributionData[] = [];
    
    // Calculate factor scores for all responses
    const allFactorScores: Record<number, number[]> = {};
    for (let i = 1; i <= 8; i++) {
      allFactorScores[i] = [];
    }
    
    allResponses.forEach(responseRow => {
      // Convert database format (q1, q2, etc.) to array
      const responseArray = Array.from({ length: 24 }, (_, i) => responseRow[`q${i + 1}`]);
      const scores = calculateFactorScoresForResponse(responseArray.filter((response): response is number => response !== null));
      
      for (let factor = 1; factor <= 8; factor++) {
        if (scores[factor] !== undefined) {
          allFactorScores[factor].push(scores[factor]);
        }
      }
    });
    
    // Create distribution bins for each factor
    for (let factor = 1; factor <= 8; factor++) {
      const scores = allFactorScores[factor];
      if (scores.length === 0) continue;
      
      // Create bins (0-20%, 20-40%, 40-60%, 60-80%, 80-100%)
      const bins = [
        { range: '0-20%', count: 0, min: 0, max: 0.2 },
        { range: '20-40%', count: 0, min: 0.2, max: 0.4 },
        { range: '40-60%', count: 0, min: 0.4, max: 0.6 },
        { range: '60-80%', count: 0, min: 0.6, max: 0.8 },
        { range: '80-100%', count: 0, min: 0.8, max: 1.0 },
      ];
      
      // Count scores in each bin
      scores.forEach(score => {
        const binIndex = bins.findIndex(bin => score >= bin.min && score < bin.max);
        if (binIndex !== -1) {
          bins[binIndex].count++;
        } else if (score === 1.0) {
          bins[4].count++; // Include 1.0 in the last bin
        }
      });
      
      // Highlight current user's bin if we have results
      if (results?.factorScores[factor] !== undefined) {
        const userScore = results.factorScores[factor];
        bins.forEach(bin => {
          if (userScore >= bin.min && (userScore < bin.max || (userScore === 1.0 && bin.max === 1.0))) {
            bin.highlight = true;
          }
        });
      }
      
      distributions.push({
        factor,
        bins: bins.map(({ range, count, highlight }) => ({ range, count, highlight }))
      });
    }
    
    return distributions;
  };

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
    
    // Calculate percentiles based on distributions
    const percentiles: Record<number, number> = {};
    distributions.forEach(dist => {
      const userScore = factorScores[dist.factor];
      if (userScore !== undefined) {
        // Simple percentile calculation based on bins
        let percentile = 0;
        dist.bins.forEach(bin => {
          if (bin.range === '0-20%' && userScore < 0.2) percentile = 10;
          else if (bin.range === '20-40%' && userScore < 0.4) percentile = 30;
          else if (bin.range === '40-60%' && userScore < 0.6) percentile = 50;
          else if (bin.range === '60-80%' && userScore < 0.8) percentile = 70;
          else if (bin.range === '80-100%') percentile = 90;
        });
        percentiles[dist.factor] = percentile;
      }
    });
    
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
      percentiles
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
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="factor" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis 
                domain={[0, 100]} 
                tick={{ fontSize: 10 }}
                axisLine={false}
              />
              <Radar 
                name="Your Score" 
                dataKey="score" 
                stroke="rgb(59, 130, 246)" 
                fill="rgba(59, 130, 246, 0.3)" 
                strokeWidth={2}
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
          
          {/* Percentile rankings */}
          {Object.keys(results.percentiles).length > 0 && (
            <div className="percentile-info">
              <h3>Your Rankings:</h3>
              {Object.entries(results.factorScores)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([factor]) => (
                  <p key={factor}>
                    {factorNames[parseInt(factor)]}: Top {100 - (results.percentiles[parseInt(factor)] || 50)}%
                  </p>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Distribution charts */}
      {distributions.length > 0 && (
        <div className="distributions-section">
          <h2>Factor Distributions</h2>
          <div className="distributions-grid">
            {distributions.map(dist => (
              <div key={dist.factor} className="distribution-chart">
                <h3>{factorNames[dist.factor]}</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={dist.bins}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="count">
                      {dist.bins.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.highlight ? 'rgb(59, 130, 246)' : '#e5e7eb'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
      )}

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