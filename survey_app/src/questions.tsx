import React, { useState } from 'react';
import './questions.css';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const SEVEN_POINT_MOODS = [
  { emoji: '😠', color: 'bg-maroon-400', label: 'Strongly Disagree', value: 1 },
  { emoji: '☹️', color: 'bg-red-400', label: 'Disagree', value: 2 },
  { emoji: '😕', color: 'bg-orange-400', label: 'Somewhat Disagree', value: 3 },
  { emoji: '😐', color: 'bg-yellow-400', label: 'Neutral', value: 4 },
  { emoji: '🙂', color: 'bg-green-400', label: 'Somewhat Agree', value: 5 },
  { emoji: '😊', color: 'bg-turquoise-400', label: 'Agree', value: 6 },
  { emoji: '😀', color: 'bg-blue-400', label: 'Strongly Agree', value: 7 },
];

const FIVE_POINT_MOODS = [
  { emoji: '🕛', color: 'bg-maroon-400', label: ' Never', value: 1 },
  { emoji: '🕒', color: 'bg-orange-400', label: 'Rarely', value: 2 },
  { emoji: '🕔', color: 'bg-yellow-400', label: 'Sometimes', value: 3 },
  { emoji: '🕠', color: 'bg-green-400', label: 'Often', value: 4 },
  { emoji: '🕢', color: 'bg-blue-400', label: 'Very Often', value: 5 },
];

const SEVEN_POINT_QUESTIONS = [
  "1. I like to explore songs from all genres",
  "2. I feel like I play a strong role in how things are recommended to me",
  "3. I worry that my music platform recommends music for its own interests not mine",
  "4. I keep up with popular/trending songs",
  "5. I think that popular artists are popular because they make better music",
  "6. I can rely on my music platform's recommendations when I want to hear something new",
  "7. I avoid app-curated playlists and mixes – I prefer my own",
  "8. I frequently listen to music by artists I haven't heard before",
  "9. I think that artists make better music when they aren't really popular",
  "10. I prefer to skip songs the platform adds or suggests automatically",
  "11. I enjoy the music my music platform plays when it takes over (e.g. autoplay, radio, mixes)",
  "12. I don't like the music my friends listen to",
  "13. I choose music without considering how I'm feeling",
  "14. I feel uneasy letting the platform decide what to play next",
  "15. I use music to better understand or make sense of my emotions"
];


const FIVE_POINT_QUESTIONS = [
  "16. How often do you make and create playlists on your music platform?",
  "17. How often do you listen to unfamiliar music?",
  "18. How often do you make playlists for friends?",
  "19. When you hear a new song from a playlist, autoplay, or other passive source, how often do you look up the artist or track to learn more?",
  "20. How often do you listen to music via full albums?",
  "21. How often do you collect physical music formats?",
  "22. How often do you make playlists for yourself?",
  "23. How often do you add to or edit your existing playlists?",
  "24. When you hear a new song from a playlist, autoplay, or other passive source, how often do you save or like it to return to later?"
];

type Mood = {
  emoji: string;
  color: string;
  label: string;
  value: number;
};

type EmojiRowProps = {
  name: string;
  selectedValue: number | null;
  onSelect: (value: number) => void;
  moods: Mood[];
};

type EmojiRowProps = {
  name: string;
  selectedValue: number | null;
  onSelect: (value: number) => void;
  moods: MoodOption[];
};

const EmojiRow: React.FC<EmojiRowProps> = ({ name, selectedValue, onSelect, moods }) => {
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
            className={`mood-button ${mood.color}${isSelected ? ' selected' : ''}`}
            onClick={() => onSelect(mood.value)}
          >
            <span className="emoji-icon">{mood.emoji}</span>
            <p className="emoji-label">{mood.label}</p>
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

const EmojiProgression: React.FC = () => {
  const navigate = useNavigate();
  const [answerError, setAnswerError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Demographics state
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');

  // Randomize questions once on mount
  const randomizedQuestions = useMemo(() => {
    const sevenPointQs: Question[] = SEVEN_POINT_QUESTIONS.map((text, index) => ({
      text,
      type: 'seven' as const,
      originalIndex: index
    }));

    const fivePointQs: Question[] = FIVE_POINT_QUESTIONS.map((text, index) => ({
      text,
      type: 'five' as const,
      originalIndex: index + SEVEN_POINT_QUESTIONS.length
    }));

    const allQuestions = [...sevenPointQs, ...fivePointQs];
    
    // Fisher-Yates shuffle
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    return allQuestions;
  }, []);

  const [responses, setResponses] = useState<Array<number | null>>(
    Array(SEVEN_POINT_QUESTIONS.length + FIVE_POINT_QUESTIONS.length).fill(null)
  );

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSelect = (originalIndex: number, value: number) => {
    setResponses((prev) => {
      const next = [...prev];
      next[originalIndex] = value;
      return next;
    });
  };

  const addResponse = async () => {
    const allQuestionsAnswered = responses.every((response) => response !== null);
    
    if (!allQuestionsAnswered) {
      setAnswerError(true);
      alert('Please answer all questions before submitting.');
      return;
    }

    if (!age || !gender) {
      alert('Please provide your age and gender.');
      return;
    }

    const formattedData = responses.reduce<Record<string, number | null | string>>((acc, response, index) => {
      acc[`q${index + 1}`] = response;
      return acc;
    }, {});

    // Add demographics
    formattedData['age'] = age;
    formattedData['gender'] = gender;

    try {
      const { data, error } = await supabase.from("responses").insert([formattedData]);

      if (error) {
        console.error('Error updating supabase:', error.message);
        alert('Error submitting responses. Please try again.');
      } else {
        console.log('Success updating supabase:', data);
        navigate('/results');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  // Track which section we're in for the frequency heading
  let frequencyHeaderShown = false;

  return (
    <div className={isDarkMode ? 'dark-theme' : 'light-theme'}>
      <div className="dark-mode-toggle">
        <button onClick={toggleDarkMode} className="toggle-btn">
          {isDarkMode ? '☀️' : '🌙'} {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      <div className="survey-header">
        <h1>Music Listening Survey</h1>
        <p className="progress-text">
          Answered: {responses.filter(r => r !== null).length} / {responses.length}
        </p>
      </div>

      <div className="questions-container">
        {randomizedQuestions.map((question, displayIndex) => {
          const isSevenPoint = question.type === 'seven';
          const moods = isSevenPoint ? SEVEN_POINT_MOODS : FIVE_POINT_MOODS;
          
          // Show frequency header before first 5-point question
          const showFrequencyHeader = !isSevenPoint && !frequencyHeaderShown;
          if (showFrequencyHeader) {
            frequencyHeaderShown = true;
          }

          return (
            <React.Fragment key={displayIndex}>
              {showFrequencyHeader && (
                <div className="section-header">
                  <h2>How often do you do the following?</h2>
                </div>
              )}
              <div className="question-block">
                <div className="question-text">
                  <span className="question-number">{displayIndex + 1}.</span> {question.text}
                </div>
                <EmojiRow
                  name={`q${question.originalIndex}`}
                  selectedValue={responses[question.originalIndex]}
                  onSelect={(value) => handleSelect(question.originalIndex, value)}
                  moods={moods}
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="demographics-section">
        <h2>About You</h2>
        <div className="demographic-field">
          <label htmlFor="age">Age:</label>
          <input
            id="age"
            type="number"
            min="13"
            max="120"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
          />
        </div>
        <div className="demographic-field">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {answerError && (
        <p className="submit-error">Please answer all questions</p>
      )}

      <button
        onClick={addResponse}
        className="submit-button"
      >
        SUBMIT
      </button>
    </div>
  );
};

export default EmojiProgression;