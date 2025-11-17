import React, { useState, useMemo } from 'react';
import './questions.css';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';


type MoodOption = {
  emoji: string;
  color: string;
  label: string;
  value: number;
};

const SEVEN_POINT_MOODS: MoodOption[] = [
  { emoji: '😠', color: 'bg-maroon-400', label: 'Strongly Disagree', value: 1 },
  { emoji: '☹️', color: 'bg-red-400', label: 'Disagree', value: 2 },
  { emoji: '😕', color: 'bg-orange-400', label: 'Somewhat Disagree', value: 3 },
  { emoji: '😐', color: 'bg-yellow-400', label: 'Neutral', value: 4 },
  { emoji: '🙂', color: 'bg-green-400', label: 'Somewhat Agree', value: 5 },
  { emoji: '😊', color: 'bg-turquoise-400', label: 'Agree', value: 6 },
  { emoji: '😀', color: 'bg-blue-400', label: 'Strongly Agree', value: 7 },
];

const FIVE_POINT_MOODS: MoodOption[] = [
  { emoji: '🕛', color: 'bg-maroon-400', label: 'Never', value: 1 },
  { emoji: '🕒', color: 'bg-orange-400', label: 'Rarely', value: 2 },
  { emoji: '🕔', color: 'bg-yellow-400', label: 'Sometimes', value: 3 },
  { emoji: '🕠', color: 'bg-green-400', label: 'Often', value: 4 },
  { emoji: '🕢', color: 'bg-blue-400', label: 'Very Often', value: 5 },
];

const SEVEN_POINT_QUESTIONS: string[] = [
  "I like to explore songs from all genres",
  "I feel like I play a strong role in how things are recommended to me", // factor 1
  "I worry that my music platform recommends music for its own interests not mine", 
  "I keep up with popular/trending songs",
  "I think that popular artists are popular because they make better music",
  "I can rely on my music platform's recommendations when I want to hear something new", // factor 1
  "I avoid app-curated playlists and mixes – I prefer my own",
  "I frequently listen to music by artists I haven't heard before",
  "I think that artists make better music when they aren't really popular",
  "I prefer to skip songs the platform adds or suggests automatically",
  "I enjoy the music my music platform plays when it takes over (e.g. autoplay, radio, mixes)", // factor 1
  "I don't like the music my friends listen to",
  "I choose music without considering how I'm feeling",
  "I feel uneasy letting the platform decide what to play next",
  "I use music to better understand or make sense of my emotions"
];

const FIVE_POINT_QUESTIONS: string[] = [
  "How often do you make and create playlists on your music platform?",
  "How often do you listen to unfamiliar music?",
  "How often do you make playlists for friends?",
  "When you hear a new song from a playlist, autoplay, or other passive source, how often do you look up the artist or track to learn more?",
  "How often do you listen to music via full albums?",
  "How often do you collect physical music formats? (e.g., vinyl, CDs, cassette tapes)",
  "How often do you make playlists for yourself?",
  "How often do you add to or edit your existing playlists?",
  "When you hear a new song from a playlist, autoplay, or other passive source, how often do you save or like it to return to later?"
];


type EmojiRowProps = {
  name: string;
  selectedValue: number | null;
  onSelect: (value: number) => void;
  moods: MoodOption[];
};

const EmojiRow: React.FC<EmojiRowProps> = ({ name, selectedValue, onSelect, moods }) => { // renders a row of emojis for a question
  return (
    <div className="scale-row" role="radiogroup" aria-label={name}>
      {moods.map((mood) => {
        const isSelected = selectedValue === mood.value;
        return (
          <button
            key={mood.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={`p-4 ${mood.color}${isSelected ? ' selected' : ''}`}
            onClick={() => onSelect(mood.value)}
          >
            <span>{mood.emoji}</span>
            <p>{mood.label}</p>
          </button>
        );
      })}
    </div>
  );
};

type Question = {
  text: string;
  type: 'seven' | 'five';
  originalIndex: number;
};



const EmojiProgression: React.FC = () => { // main component
  
  const [age, setAge] = useState("");
  const [race, setRace] = useState<string[]>([]);
  const [gender, setGender] = useState("");
  const [singlepredictor, setSinglePredictor] = useState("");
  const [nationality, setNationality] = useState("");
  const [streamFrequency, setStreamFrequency] = useState("3");

  const navigate = useNavigate();
  const [answerError, setAnswerError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const randomizedQuestions = useMemo(() => {
    const sevenPointQs: Question[] = SEVEN_POINT_QUESTIONS.map((text, index) => ({
      text,
      type: 'seven' as const,
      originalIndex: index // Randomize WITH OG index
    }));

    const fivePointQs: Question[] = FIVE_POINT_QUESTIONS.map((text, index) => ({
      text,
      type: 'five' as const,
      originalIndex: index + SEVEN_POINT_QUESTIONS.length
    }));

    const allQuestions = [...sevenPointQs, ...fivePointQs];
    
    for (let i = allQuestions.length - 1; i > 0; i--) { // randomizes question
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    return allQuestions;
  }, []);

  const [responses, setResponses] = useState<Array<number | null>>(
    Array(SEVEN_POINT_QUESTIONS.length + FIVE_POINT_QUESTIONS.length).fill(null)
  );

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  
  const toggleRace = (value: string) => {
    setRace(prev =>
      prev.includes(value)
        ? prev.filter(r => r !== value)
        : [...prev, value]
    );
  };
  
  const handleSelect = (originalIndex: number, value: number) => { // updated response array
    setResponses((prev) => {
      const next = [...prev];
      next[originalIndex] = value;
      return next;
    });
  };

  const addResponse = async () => {
    if (!singlepredictor.trim() || !streamFrequency.trim() || !age.trim())
    {
      setAnswerError(true);
      alert('Please answer demographic and baseline questions before submittin.')
      return;
    }

    if (!responses.every((r) => r !== null)) {
      setAnswerError(true);
      alert('Please answer all questions before submitting.');
      return;
    }
  
    const formattedData = responses.reduce<Record<string, number | null>>((acc, response, index) => {
      acc[`q${index + 1}`] = response;
      return acc;
    }, {});
  
    try {
      const { error } = await supabase.from("responses").insert([
        {
          ...formattedData,
          Age: age,
          Single_Pred: singlepredictor,
          Gender: gender,
          Race: race.length > 0 ? race : null,
          Nationality: nationality,
          Stream_Freq: streamFrequency,
        }
      ]);
  
      if (error) {
        console.error('Supabase insert error:', error);
        alert(`Error submitting responses: ${error.message}`);
        return;
      }
  
      navigate('/results', { state: { responses } });
    } catch (err) { 
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred.');
    }
  };
  

  
  return ( // jsx rendering!
    <div className={isDarkMode ? 'dark-theme' : 'light-theme'}>
      <div className="dark-mode-toggle">
        <button onClick={toggleDarkMode} className="toggle-btn">
          {isDarkMode ? '☀️' : '🌙'} {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>
      <div className = "Definitions">
      <p>
      This survey is about your music listening habits and includes questions about your music preferences, how you use music streaming platforms, and how recommendation features affect your listening experience. Below are a few definitions to help clarify the terms we’ll be using - please review these carefully.
      <br/><br/>
- Music Streaming Platform or App: These refer to services like Spotify, Apple Music, YouTube, TIDAL, etc., where you can stream music on demand
<br/><br/>
- Algorithmic / Recommendation Features: These are automatic systems that suggest songs, albums, or artists based on your listening history or preferences. Examples include: Autoplay (when music keeps playing after your playlist or album ends), Smart Shuffle, Daily Mixes, Discover Weekly, Daylist, “Because you listened to…” suggestions
<br/>- Platform-Curated Playlists or Mixes: These are playlists made by the music app (not by a person you know), often tailored to your taste or mood, like “Chill Vibes”, “Throwback Hits”, or “Your Summer Rewind”
<br/><br/>
</p>

      </div>
      <div className="demographic-info-container">
        <label>Demographic Data</label>

        <div className="age-input">
          <input value={age} placeholder="Age *" onChange={(e) => setAge(e.target.value)} />
        </div>

        <div className="predictor-dropdown">
          <select value={singlepredictor} onChange={(e) => setSinglePredictor(e.target.value)}>
            <option value="" disabled hidden>Which title best describes you? *</option>
            <option value="Nonmusician">Nonmusician</option>
            <option value="Music-loving nonmusician">Music-loving nonmusician</option>
            <option value="Amateur musician">Amateur musician</option>
            <option value="Serious amateur musician">Serious amateur musician</option>
            <option value="Semi-professional musician">Semi-professional musician</option>
            <option value="Professional musician">Professional musician</option>
          </select>
        </div>

        {/* STREAMING FREQUENCY — slider 1–5 */}
        <div className="frequency-slider">
          <label>How often do you use music streaming platforms? * (1–5)</label>

          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={streamFrequency}
            onChange={(e) => setStreamFrequency(e.target.value)}
            className="slider"
          />

          {/* Tick marks */}
          <div className="slider-ticks">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>


        <div className="race-checkbox-group">
        <div className="race-title">What is your race? (Select all that apply, optional)</div>

        {[
          "American Indian or Alaska Native",
          "Asian",
          "Black or African American",
          "Hispanic, Latino, or Spanish origin",
          "Middle Eastern or North African",
          "White"
        ].map((option) => (
          <label key={option} className="checkbox-item">
            <input
              type="checkbox"
              checked={race.includes(option)}
              onChange={() => toggleRace(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>



        {/* GENDER — optional */}
        <div className="gender-dropdown">
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Gender (optional)</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Nonbinary">Nonbinary</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        {/* NATIONALITY — now optional */}
        <div className="nationality-input">
          <label>In what country do you typically listen to music? (Optional)</label>
          <input
            value={nationality}
            placeholder="Country (optional)"
            onChange={(e) => setNationality(e.target.value)}
          />
        </div>

      </div>

      <div className="questions-container">
        {randomizedQuestions.map((question, displayIndex) => {
          const moods = question.type === 'seven' ? SEVEN_POINT_MOODS : FIVE_POINT_MOODS;
          
          return (
            <div key={displayIndex} className="question-block">
              <div className="question-text">
                {displayIndex + 1}. {question.text}
              </div>
              <EmojiRow
                name={`q${question.originalIndex}`}
                selectedValue={responses[question.originalIndex]}
                onSelect={(value) => handleSelect(question.originalIndex, value)}
                moods={moods}
              />
            </div>
          );
        })}
      </div>

      {answerError && <p className="submit-error">Please answer all questions</p>}
      <button onClick={addResponse} className="submit-button">SUBMIT</button>
    </div>
  );
};

export default EmojiProgression;


//https://www.react-graph-gallery.com/radar-chart