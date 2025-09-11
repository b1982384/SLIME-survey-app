import React, { useState } from 'react';
import './questions.css';

type MoodOption = {
  emoji: string;
  color: string;
  label: string;
  value: number;
};

const MOODS: MoodOption[] = [
  { emoji: '😠', color: 'bg-maroon-400', label: 'Strongly Disagree', value: 1 },
  { emoji: '☹️', color: 'bg-red-400', label: 'Disagree', value: 2 },
  { emoji: '😕', color: 'bg-orange-400', label: 'Somewhat Disagree', value: 3 },
  { emoji: '😐', color: 'bg-yellow-400', label: 'Neutral', value: 4 },
  { emoji: '🙂', color: 'bg-green-400', label: 'Somewhat Agree', value: 5 },
  { emoji: '😊', color: 'bg-turquoise-400', label: 'Agree', value: 6 },
  { emoji: '😀', color: 'bg-blue-400', label: 'Strongly Agree', value: 7 },
];

const QUESTIONS: string[] = [
  'I feel like I play a strong role in how things are recommended to me',
  'I enjoy the music my music platform plays when it takes over (e.g. autoplay, radio, mixes)',
  "I can rely on my music platform's recommendations when I want to hear something new",
  'I prefer to skip songs the platform adds or suggests automatically',
  'I feel uneasy letting the platform decide what to play next',
  'I avoid app-curated playlists and mixes – I prefer my own',
  'I add or edit my existing playlists',
  'I make playlists for myself',
  'I make and create playlists on my music platform',
];

type EmojiRowProps = {
  name: string;
  selectedValue: number | null;
  onSelect: (value: number) => void;
};

const EmojiRow: React.FC<EmojiRowProps> = ({ name, selectedValue, onSelect }) => {
  return (
    <div className="scale-row" role="radiogroup" aria-label={name}>
      {MOODS.map((mood) => {
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

const EmojiProgression: React.FC = () => {
  const [responses, setResponses] = useState<Array<number | null>>(
    Array(QUESTIONS.length).fill(null)
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
      {QUESTIONS.map((q, index) => (
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