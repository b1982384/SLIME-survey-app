import React, { useState } from 'react';
import './questions.css';

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

const SEVEN_POINT_QUESTIONS: string[] = [
  'I feel uneasy letting the platform decide what to play next',
  'I enjoy the music my music platform plays when it takes over (e.g. autoplay, radio, mixes)',
  'I use music to better understand or make sense of my emotions',
  'I like to explore songs from all genres',
  'I avoid app-curated playlists and mixes – I prefer my own',
  'I keep up with popular/trending songs',
  'I prefer to find my own music and tend not to listen to what others think (negatively weighted)',
  'I feel like I play a strong role in how things are recommended to me',
  'I choose music without considering how Im feeling (negatively weighted)',
  'I prefer to skip songs the platform adds or suggests automatically',
  'I dont like the music my friends listen to',
  'I can rely on my music platforms recommendations when I want to hear something new',
  'I think that artists make better music when they arent really popular',
  'I worry that my music platform recommends music for its own interests not mine',
  'I frequently listen to music by artists I havent heard before',

];

const FIVE_POINT_QUESTIONS: string[] = [
  'I will listen to music via… - Full albums',
  'Please indicate how often you do the following statements: - I make and create playlists on my music platform',
  'Please indicate how often you do the following statements: - I listen to unfamiliar music',
  'When I hear a new song from a playlist, autoplay, or other passive source, I save or like it to return to later.',
  'When I hear a new song from a playlist, autoplay, or other passive source, I look up the artist or track to learn more.',
  'I collect physical music formats',
  'I add or edit my existing playlists',
  'I make playlists for friends',
  'I make playlists for myself',
]

type EmojiRowProps = {
  name: string;
  selectedValue: number | null;
  onSelect: (value: number) => void;
};

const EmojiRow: React.FC<EmojiRowProps> = ({ name, selectedValue, onSelect }) => {
  return (
    <div className="scale-row" role="radiogroup" aria-label={name}>
      {SEVEN_POINT_MOODS.map((mood) => {
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

// creates block for each question - 
// each block has  emoji row (in classname question text)
// emoji row has 7 buttons - from moods (above)
// click a button = calls onSelect and passes in a value
// onSelect does the handleSelect which updates the response array fo reach question
// rerenders UI - button added to selected
const EmojiProgression: React.FC = () => {
  const [responses, setResponses] = useState<Array<number | null>>(
    Array(SEVEN_POINT_QUESTIONS.length).fill(null)
  );

  const handleSelect = (questionIndex: number, value: number) => {
    setResponses((prev) => {
      const next = [...prev];
      next[questionIndex] = value;
      return next;
    });
  };

  return (
    <div className="questions-container">
      {SEVEN_POINT_QUESTIONS.map((q, index) => (
        <div key={index} className="question-block">
          <div className="question-text">{q}</div>
          <EmojiRow
            name={`q${index}`}
            selectedValue={responses[index]}
            onSelect={(value) => handleSelect(index, value)}
          />
        </div>
      ))}
    </div>
  );
};

export default EmojiProgression;