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
  '1. I like to explore songs from all genres',
  '2. I feel like I play a strong role in how things are recommended to me',
  '3. I worry that my music platform recommends music for its own interests not mine',
  '4. I keep up with popular/trending songs',
  '5. I prefer to find my own music and tend not to listen to what others think (negatively weighted)',
  '6. I can rely on my music platforms recommendations when I want to hear something new',
  '7. I avoid app-curated playlists and mixes – I prefer my own',
  '8. I frequently listen to music by artists I havent heard before',
  '9. I think that artists make better music when they arent really popular',
  '10. I prefer to skip songs the platform adds or suggests automatically',
  '11. I enjoy the music my music platform plays when it takes over (e.g. autoplay, radio, mixes)',
  '12. I dont like the music my friends listen to',
  '13. I choose music without considering how Im feeling (negatively weighted)',
  '14. I feel uneasy letting the platform decide what to play next',
  '15. I use music to better underst'
];

const FIVE_POINT_MOODS: MoodOption[] = [
  { emoji: '🕛', color: 'bg-maroon-400', label: ' Never', value: 1 },
  { emoji: '🕒', color: 'bg-orange-400', label: 'Rarely', value: 2 },
  { emoji: '🕔', color: 'bg-yellow-400', label: 'Sometimes', value: 3 },
  { emoji: '🕠', color: 'bg-green-400', label: 'Often', value: 4 },
  { emoji: '🕢', color: 'bg-blue-400', label: 'Very Often', value: 5 },
];


const FIVE_POINT_QUESTIONS: string[] = [
  '16. Please indicate how often you do the following statements: - I make and create playlists on my music platform',
  '17. Please indicate how often you do the following statements: - I listen to unfamiliar music',
  '18. I make playlists for friends',
  '19. When I hear a new song from a playlist, autoplay, or other passive source, I look up the artist or track to learn more.',
  '20. I will listen to music via… - Full albums',
  '21. I collect physical music formats',
  '22. I make playlists for myself',
  '23. I add or edit my existing playlists',
  '24. When I hear a new song from a playlist, autoplay, or other passive source, I save or like it to return to later.'
];



type EmojiRowProps = {
  name: string;
  selectedValue: number | null;
  onSelect: (value: number) => void;
};

const SevenEmojiRow: React.FC<EmojiRowProps> = ({ name, selectedValue, onSelect }) => {
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

const FiveEmojiRow: React.FC<EmojiRowProps> = ({ name, selectedValue, onSelect}) => {
  return (
  <div className="scale-row" role="radiogroup" aria-label={name}>
      {FIVE_POINT_MOODS.map((mood) => {
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
    </div>);
}

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
    <div>
    <div className="questions-container">
      {SEVEN_POINT_QUESTIONS.map((q, index) => (
        <div key={index} className="question-block">
          <div className="question-text">{q}</div>
          <SevenEmojiRow
            name={`q${index}`}
            selectedValue={responses[index]}
            onSelect={(value) => handleSelect(index, value)}
          />
        </div>
      ))}
    </div>
    <div>
    {FIVE_POINT_QUESTIONS.map((q, index) => (
        <div key={index} className="question-block">
          <div className="question-text">{q}</div>
          <FiveEmojiRow
            name={`q${index}`}
            selectedValue={responses[index]}
            onSelect={(value) => handleSelect(index, value)}
          />
        </div>
      ))}
    </div>
  </div>
  );
};

export default EmojiProgression;